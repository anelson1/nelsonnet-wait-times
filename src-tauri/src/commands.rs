use tauri_plugin_http::reqwest;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
struct Ride {
    name: String,
    id: u32,
    wait_time: u32,
    is_open: bool,
    last_updated: String,
}
#[derive(Serialize, Deserialize, Debug)]
struct Land {
    name: String,
    id: u32,
    rides: Vec<Ride>,
}
#[derive(Serialize, Deserialize, Debug)]
pub struct WaitTimeResponse {
    lands: Vec<Land>,
    rides: Vec<Ride>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct WaitTimeFormatted {
    pub id: u32,
    pub land_name: String,
    pub ride_name: String,
    pub wait_time: u32,
    pub is_open: bool,
    pub last_updated: String,
}

const BLACKLISTED_IDS: [u32; 1] = [1184]; // Example IDs to be blacklisted

#[tauri::command]
pub async fn fetch_ride_wait_times(park_id: u32) -> Result<Vec<WaitTimeFormatted>, ()> {
    let res = reqwest::get(format!(
        "https://queue-times.com/parks/{}/queue_times.json",
        park_id
    ))
    .await;
    if res.is_err() {
        return Err(());
    }
    let wait_time_response = res
        .unwrap()
        .json::<WaitTimeResponse>()
        .await
        .map_err(|_| ())?;
    let wait_time_formatted: Vec<WaitTimeFormatted> = wait_time_response
        .lands
        .iter()
        .flat_map(|land| {
            land.rides.iter().map(move |ride| WaitTimeFormatted {
                id: ride.id,
                land_name: land.name.clone(),
                ride_name: ride.name.clone(),
                wait_time: ride.wait_time,
                is_open: ride.is_open,
                last_updated: ride.last_updated.clone(),
            })
        })
        .collect();
    let wait_time_formatted: Vec<WaitTimeFormatted> = wait_time_formatted
        .into_iter()
        .filter(|ride| !BLACKLISTED_IDS.contains(&ride.id))
        .collect();
    Ok(wait_time_formatted)
}
