export function GetData(url) {

    return new Promise((resolve, reject) => {
         fetch(url, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            }
        })
        .then((response) => response.json())
        .then((responseJson) => {
            resolve(responseJson);
        })
        .catch((error) => {
            reject(error);
        });
    });
}

export function GetDataAuth(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const userData = sessionStorage.getItem("userData");

        if (!userData) {
            reject(new Error("User data not found in session storage"));
            return;
        }

        const parsedData = JSON.parse(userData);
        const accessToken = parsedData?.access_token;

        if (!accessToken) {
            reject(new Error("Access token not found in user data"));
            return;
        }

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            }
        })
        .then((response) => response.json())
        .then((responseJson) => {
            resolve(responseJson);
        })
        .catch((error) => {
            reject(error);
        });
    });
}

