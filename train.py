import torch
import torch.nn as nn
from tqdm import tqdm
from pathlib import Path
from sklearn.metrics import classification_report
import numpy as np

from config import (
    DATA_DIR, MODEL_DIR, DEVICE, BATCH_SIZE, NUM_WORKERS,
    EPOCHS_HEAD, EPOCHS_FINETUNE, LR_HEAD, LR_FINETUNE, BINS
)
from dataset import make_dataloaders
from model import build_model, unfreeze_model


def train_one_epoch(model, loader, optimizer, criterion, device):
    model.train()
    total_loss, correct, total = 0, 0, 0
    for imgs, labels in tqdm(loader, leave=False):
        imgs, labels = imgs.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(imgs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        total_loss += loss.item() * imgs.size(0)
        correct += (outputs.argmax(1) == labels).sum().item()
        total += imgs.size(0)
    return total_loss / total, correct / total


@torch.no_grad()
def evaluate(model, loader, criterion, device):
    model.eval()
    total_loss, correct, total = 0, 0, 0
    all_preds, all_labels = [], []
    for imgs, labels in loader:
        imgs, labels = imgs.to(device), labels.to(device)
        outputs = model(imgs)
        loss = criterion(outputs, labels)
        total_loss += loss.item() * imgs.size(0)
        preds = outputs.argmax(1)
        correct += (preds == labels).sum().item()
        total += imgs.size(0)
        all_preds.extend(preds.cpu().numpy())
        all_labels.extend(labels.cpu().numpy())
    return total_loss / total, correct / total, all_preds, all_labels


def run_phase(model, train_loader, val_loader, epochs, lr, device, phase_name):
    optimizer = torch.optim.AdamW(
        filter(lambda p: p.requires_grad, model.parameters()), lr=lr, weight_decay=1e-4
    )
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)
    criterion = nn.CrossEntropyLoss()

    best_val_acc = 0
    best_path = MODEL_DIR / "best_model_v3.pth"

    print(f"\n{'='*50}")
    print(f"Phase: {phase_name} — {epochs} epochs, lr={lr}")
    print(f"{'='*50}")

    for epoch in range(1, epochs + 1):
        train_loss, train_acc = train_one_epoch(model, train_loader, optimizer, criterion, device)
        val_loss, val_acc, _, _ = evaluate(model, val_loader, criterion, device)
        scheduler.step()

        print(f"Epoch {epoch:>3}/{epochs} | "
              f"train loss {train_loss:.4f} acc {train_acc:.3f} | "
              f"val loss {val_loss:.4f} acc {val_acc:.3f}")

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), best_path)
            print(f"  ✓ saved best model (val acc {best_val_acc:.3f})")

    return best_val_acc


def main():
    device = torch.device(DEVICE if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    train_loader, val_loader = make_dataloaders(DATA_DIR, batch_size=BATCH_SIZE, num_workers=NUM_WORKERS)

    # Phase 1: train classifier head only (reuse old backbone if available)
    old_weights = MODEL_DIR / "best_model_v2.pth"
    model = build_model(
        freeze_backbone=True,
        weights_path=old_weights if old_weights.exists() else None
    ).to(device)
    run_phase(model, train_loader, val_loader, EPOCHS_HEAD, LR_HEAD, device, "Head only")

    # Phase 2: fine-tune full network
    model.load_state_dict(torch.load(MODEL_DIR / "best_model_v3.pth"))
    unfreeze_model(model)
    run_phase(model, train_loader, val_loader, EPOCHS_FINETUNE, LR_FINETUNE, device, "Full fine-tune")

    # Final evaluation with per-class report
    model.load_state_dict(torch.load(MODEL_DIR / "best_model_v3.pth"))
    criterion = nn.CrossEntropyLoss()
    _, final_acc, preds, labels = evaluate(model, val_loader, criterion, device)
    print(f"\nFinal val accuracy: {final_acc:.3f}")
    print(classification_report(labels, preds, target_names=BINS))


if __name__ == "__main__":
    main()
