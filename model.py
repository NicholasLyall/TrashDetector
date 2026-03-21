import torch
import torch.nn as nn
import timm
from config import MODEL_NAME, NUM_CLASSES


def build_model(freeze_backbone=True) -> nn.Module:
    model = timm.create_model(MODEL_NAME, pretrained=True, num_classes=NUM_CLASSES)

    if freeze_backbone:
        for name, param in model.named_parameters():
            if "classifier" not in name:
                param.requires_grad = False

    return model


def unfreeze_model(model: nn.Module):
    for param in model.parameters():
        param.requires_grad = True
