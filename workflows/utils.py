# Workflow utilities module
# Common functions for HOMAI workflows

from typing import Dict, Any, List
import json


def load_property_data(file_path: str) -> Dict[str, Any]:
    """Load property data from JSON file"""
    with open(file_path, 'r') as f:
        return json.load(f)


def save_results(results: Dict[str, Any], output_path: str):
    """Save workflow results to file"""
    with open(output_path, 'w') as f:
        json.dump(results, f, indent=2)


def format_property_summary(property_data: Dict[str, Any]) -> str:
    """Format property data as readable summary"""
    return f"""
Property Summary:
- Address: {property_data.get('address', 'N/A')}
- Price: ${property_data.get('price', 'N/A'):,.0f}
- Size: {property_data.get('sqft', 'N/A')} sq ft
- Beds/Baths: {property_data.get('beds', 'N/A')}/{property_data.get('baths', 'N/A')}
- Year Built: {property_data.get('year_built', 'N/A')}
- Type: {property_data.get('property_type', 'N/A')}
"""


def validate_property_data(property_data: Dict[str, Any]) -> List[str]:
    """Validate property data and return list of issues"""
    issues = []
    required = ['address']
    optional = ['price', 'sqft', 'beds', 'baths', 'year_built', 'property_type']
    
    for field in required:
        if field not in property_data or not property_data[field]:
            issues.append(f"Missing required field: {field}")
    
    return issues
