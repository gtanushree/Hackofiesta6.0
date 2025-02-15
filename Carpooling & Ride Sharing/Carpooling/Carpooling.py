from geopy.distance import geodesic
import pandas as pd
import Function

# Load dataset
df = pd.read_csv("ridesharing_carpooling_data.csv")

# Find matching rides near a location
def find_matching_rides(location_name, max_distance_km=2):
    user_lat, user_long = Function.get_coordinates(location_name)
    
    if user_lat is None or user_long is None:
        return {"error": "Invalid location name"}

    matching_rides = []
    
    for index, row in df.iterrows():
        ride_lat, ride_long = Function.get_coordinates(row["pickup_location"])
        if ride_lat and ride_long:
            distance = geodesic((user_lat, user_long), (ride_lat, ride_long)).km
            if distance <= max_distance_km:
                matching_rides.append(row.to_dict())

    return matching_rides

# Example: Find rides near Connaught Place
matches = find_matching_rides("Connaught Place, Delhi")
print(f"Matching Rides Found: {len(matches)}")

# Find matching carpooling rides for a user
def find_carpooling_rides(location_name, organization_name, max_distance_km=2):
    user_lat, user_long = Function.get_coordinates(location_name)
    
    if user_lat is None or user_long is None:
        return {"error": "Invalid location name"}

    matching_carpool = []
    
    for index, row in df.iterrows():
        if row["organization"] != organization_name:
            continue  # Skip if organization does not match
        
        ride_lat, ride_long = Function.get_coordinates(row["pickup_location"])
        if ride_lat and ride_long:
            distance = geodesic((user_lat, user_long), (ride_lat, ride_long)).km
            if distance <= max_distance_km and row["carpooling_preference"] == "Yes":
                matching_carpool.append(row.to_dict())

    return matching_carpool

# Example: Find carpooling rides for Google employees near Connaught Place
matches = find_carpooling_rides("Connaught Place, Delhi", "Google")
print(f"Matching Carpooling Rides Found: {len(matches)}")
