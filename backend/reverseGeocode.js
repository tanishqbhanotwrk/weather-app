export const handler = async (event) => {
    try {
        const {lat, long} = event.queryStringParameters || {};

        if(!lat || !long) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Lat and Long is required."
                })
            }
        }

        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
            {
                headers: {
                    "User-agent": "weatherapp"
                }
            }
        );

        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: {
                displayName: data.display_name,
                address: data.address
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