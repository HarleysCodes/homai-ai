# Core module for HOMAI
# Business logic and utilities

from typing import Dict, Any, Optional
import json


class Property:
    """Property data model"""
    
    def __init__(
        self,
        address: str,
        price: Optional[float] = None,
        sqft: Optional[int] = None,
        beds: Optional[int] = None,
        baths: Optional[float] = None,
        year_built: Optional[int] = None,
        property_type: str = "single_family"
    ):
        self.address = address
        self.price = price
        self.sqft = sqft
        self.beds = beds
        self.baths = baths
        self.year_built = year_built
        self.property_type = property_type
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "address": self.address,
            "price": self.price,
            "sqft": self.sqft,
            "beds": self.beds,
            "baths": self.baths,
            "year_built": self.year_built,
            "property_type": self.property_type
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Property':
        return cls(
            address=data.get("address", ""),
            price=data.get("price"),
            sqft=data.get("sqft"),
            beds=data.get("beds"),
            baths=data.get("baths"),
            year_built=data.get("year_built"),
            property_type=data.get("property_type", "single_family")
        )


def calculate_price_per_sqft(price: float, sqft: int) -> float:
    """Calculate price per square foot"""
    if sqft <= 0:
        return 0
    return price / sqft


def estimate_mortgage(price: float, down_payment: float = 0.2, rate: float = 0.07, years: int = 30) -> float:
    """Estimate monthly mortgage payment"""
    principal = price * (1 - down_payment)
    monthly_rate = rate / 12
    num_payments = years * 12
    
    if monthly_rate == 0:
        return principal / num_payments
    
    payment = principal * (monthly_rate * (1 + monthly_rate) ** num_payments) / ((1 + monthly_rate) ** num_payments - 1)
    return payment
