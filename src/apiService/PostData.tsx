import axios from "axios";

export function PostData(url: string, userData: any): Promise<any> {
    return new Promise((resolve, reject) => {
        axios.post(url, userData, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response) => {
            resolve(response.data);
        })
        .catch((error) => {
            reject(error);
        });
    });
}

export function PostDataAuth(url: string, userData: any): Promise<any> {
    return new Promise((resolve, reject) => {
        const userDataFromStorage = sessionStorage.getItem("userData");

        if (!userDataFromStorage) {
            reject(new Error("User data not found in session storage"));
            return;
        }

        let accessToken: string;
        try {
            const parsedData = JSON.parse(userDataFromStorage);
            accessToken = parsedData?.access_token;
        } catch (error) {
            reject(new Error("Error parsing user data from session storage"));
            return;
        }

        if (!accessToken) {
            reject(new Error("Access token not found in user data"));
            return;
        }

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
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


