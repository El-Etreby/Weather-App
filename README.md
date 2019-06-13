## **Weather-App**

Simple API that given a phone number sends an SMS containing informations about the current weather in Cairo.

-   **URL**
    
    /weather
    
-   **Method:**
    
    `POST`
    
-   **Data Params**
    
    `{ phone_number: "+201065781197" }`
    
-   **Success Response:**
    -   **Code:**  200  
        **Content:**  `{ SUCCESS : true }`
-   **Error Response:**
    -   **Code:**  400/422 
        **Content:**  `{ SUCCESS : false }`
    
-   **Deployment Link:**
[https://node-weather-task.herokuapp.com/](https://node-weather-task.herokuapp.com/)
