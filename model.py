import torch
import torch.nn as nn
import timm
from config import MODEL_NAME, NUM_CLASSES


def build_model(freeze_backbone=True, weights_path=None) -> nn.Module:
    model = timm.create_model(MODEL_NAME, pretrained=True, num_classes=NUM_CLASSES)

    if weights_path is not None:
        # Load old backbone weights only, ignore classifier head
        old_state = torch.load(weights_path, map_location="cpu")
        new_state = model.state_dict()
        transferable = {k: v for k, v in old_state.items()
                        if k in new_state and "classifier" not in k and v.shape == new_state[k].shape}
        new_state.update(transferable)
        model.load_state_dict(new_state)
        print(f"Loaded {len(transferable)}/{len(new_state)} layers from {weights_path}")

    if freeze_backbone:
        for name, param in model.named_parameters():
            if "classifier" not in name:
                param.requires_grad = False

    return model


def unfreeze_model(model: nn.Module):
    for param in model.parameters():
        param.requires_grad = True
