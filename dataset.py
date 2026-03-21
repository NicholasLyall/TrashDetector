from pathlib import Path
from PIL import Image
from torch.utils.data import Dataset, DataLoader, WeightedRandomSampler
from torchvision import transforms
import torch
import numpy as np
from config import CLASS_MAP, BINS, IMG_SIZE


def get_transforms(train: bool):
    if train:
        return transforms.Compose([
            transforms.RandomResizedCrop(IMG_SIZE, scale=(0.7, 1.0)),
            transforms.RandomHorizontalFlip(),
            transforms.RandomVerticalFlip(),
            transforms.ColorJitter(brightness=0.4, contrast=0.4, saturation=0.3, hue=0.1),
            transforms.RandomRotation(30),
            transforms.RandomGrayscale(p=0.05),
            transforms.GaussianBlur(kernel_size=3, sigma=(0.1, 1.5)),  # simulates webcam blur
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
        ])
    else:
        return transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(IMG_SIZE),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
        ])


class RealWasteDataset(Dataset):
    def __init__(self, data_dir: Path, transform=None):
        self.samples = []
        self.transform = transform

        for source_class_dir in data_dir.iterdir():
            if not source_class_dir.is_dir():
                continue
            source_name = source_class_dir.name.lower().replace(" ", "_").replace("-", "_")
            bin_label = CLASS_MAP.get(source_name)
            if bin_label is None:
                print(f"Warning: unmapped class '{source_name}', skipping")
                continue
            label_idx = BINS.index(bin_label)
            for img_path in source_class_dir.iterdir():
                if img_path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}:
                    self.samples.append((img_path, label_idx))

        print(f"Loaded {len(self.samples)} images from {data_dir}")
        self._print_distribution()

    def _print_distribution(self):
        counts = [0] * len(BINS)
        for _, label in self.samples:
            counts[label] += 1
        for bin_name, count in zip(BINS, counts):
            print(f"  {bin_name}: {count}")

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        img_path, label = self.samples[idx]
        img = Image.open(img_path).convert("RGB")
        if self.transform:
            img = self.transform(img)
        return img, label


def make_weighted_sampler(dataset: RealWasteDataset):
    """Oversample underrepresented bins so each bin gets equal training exposure."""
    labels = [label for _, label in dataset.samples]
    counts = np.bincount(labels, minlength=len(BINS))
    weights_per_class = 1.0 / counts
    sample_weights = torch.tensor([weights_per_class[l] for l in labels], dtype=torch.float)
    return WeightedRandomSampler(sample_weights, num_samples=len(sample_weights), replacement=True)


def make_dataloaders(data_dir: Path, val_split=0.15, batch_size=32, num_workers=4):
    full_dataset = RealWasteDataset(data_dir, transform=None)

    n = len(full_dataset)
    n_val = int(n * val_split)
    n_train = n - n_val

    indices = torch.randperm(n).tolist()
    train_indices, val_indices = indices[:n_train], indices[n_train:]

    train_dataset = RealWasteDataset(data_dir, transform=get_transforms(train=True))
    val_dataset = RealWasteDataset(data_dir, transform=get_transforms(train=False))

    # Subset by overriding samples list
    train_dataset.samples = [full_dataset.samples[i] for i in train_indices]
    val_dataset.samples = [full_dataset.samples[i] for i in val_indices]

    sampler = make_weighted_sampler(train_dataset)

    train_loader = DataLoader(
        train_dataset, batch_size=batch_size, sampler=sampler,
        num_workers=num_workers, pin_memory=True
    )
    val_loader = DataLoader(
        val_dataset, batch_size=batch_size, shuffle=False,
        num_workers=num_workers, pin_memory=True
    )
    return train_loader, val_loader
