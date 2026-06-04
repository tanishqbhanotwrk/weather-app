export const handler = async (event) => {
    try {
        const {lat, long} = event.queryStringParameters || {};
        if(!lat || !long){
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Lat and Long required."
                })
            }
        }

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY || "f2e5bd2020b8621101973bb2d97718a2"}&units=metric`
        );

        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: {
                city: data.name,
                country: data.sys.country,
                temperature: data.main.temp,
                feelsLike: data.main.feels_like,
                humidity: data.main.humidity,
                pressure: data.main.pressure,
                windSpeed: data.wind.speed,
                description: data.weather[0].description,
                icon: data.weather[0].icon
            }
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message
            })
        }
    }
}