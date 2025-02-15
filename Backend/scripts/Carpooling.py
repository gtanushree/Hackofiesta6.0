import sys
import json
import pandas as pd
from geopy.distance import geodesic
from geopy.geocoders import Nominatim

# Load dataset
df = pd.read_csv("./idesharing_carpooling_data.csv")

# Function to get coordinates from location name
def get_coordinates(location_name):
    geolocator = Nominatim(user_agent="geoapi", timeout=10)
    location = geolocator.geocode(location_name)
    
    if location:
        return location.latitude, location.longitude
    else:
        return None, None

# Find matching rides near a location
def find_matching_rides(location_name, max_distance_km=2):
    user_lat, user_long = get_coordinates(location_name)
    
    if user_lat is None or user_long is None:
        return {"error": "Invalid location name"}

    matching_rides = []
    
    for _, row in df.iterrows():
        ride_lat, ride_long = get_coordinates(row["pickup_location"])
        if ride_lat and ride_long:
            distance = geodesic((user_lat, user_long), (ride_lat, ride_long)).km
            if distance <= max_distance_km:
                matching_rides.append(row.to_dict())

    return matching_rides

# Find matching carpooling rides for a user
def find_carpooling_rides(location_name, organization_name, max_distance_km=2):
    user_lat, user_long = get_coordinates(location_name)
    
    if user_lat is None or user_long is None:
        return {"error": "Invalid location name"}

    matching_carpool = []
    
    for _, row in df.iterrows():
        if row["organization"] != organization_name:
            continue  # Skip if organization does not match
        
        ride_lat, ride_long = get_coordinates(row["pickup_location"])
        if ride_lat and ride_long:
            distance = geodesic((user_lat, user_long), (ride_lat, ride_long)).km
            if distance <= max_distance_km and row["carpooling_preference"].lower() == "yes":
                matching_carpool.append(row.to_dict())

    return matching_carpool

# Main execution for integration with Node.js
if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: python3 Carpooling.py <location> <organization>"}))
        sys.exit(1)

    location = sys.argv[1]
    organization = sys.argv[2]

    results = find_carpooling_rides(location, organization)
    print(json.dumps(results))  # Return JSON output
