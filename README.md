# Solar Data Ingestion Service
## This service fetches solar radiation, weather, and rooftop PV power data from an external API, processes it, and stores it in a PostgreSQL database.

##Prerequisites
Before running the application, ensure you have the following installed:

Node.js (v16+ recommended)
PostgreSQL
Git

### 1. **Clone  the Repository**

git clone <repository-url>
cd <repository-folder>

### 2. Install Dependencies
   npm install

### 3.Configure Environment Variables
Create a .env file in the project root and add the following variables

### PostgreSQL Database Configuration
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=5432  # Default PostgreSQL port


### 4. Create Table in PostgreSQL to store data.

CREATE TABLE solcast_data (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP,
    air_temp FLOAT,
    dni FLOAT,
    dhi FLOAT,
    relative_humidity FLOAT,
    surface_pressure FLOAT,
    wind_speed_10m FLOAT,
    pv_power_rooftop FLOAT
);

### 5. Start the Application
   npm start
