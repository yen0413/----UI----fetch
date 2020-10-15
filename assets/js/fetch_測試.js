const getBtn = document.getElementById('get-btn');
const postBtn = document.getElementById('post-btn');


const sendHttpRequest = (method, url, data) => {  //fetch的上半部整理成function
    return fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: data ? { 'Content-Type': 'application/json' } : {} //{}裡面可放物件//三元表達式？
    })  //get data  
        .then(response => {
            if (response.status >= 400) {       //參考xml httprequest對於錯誤的處理方法
                //!response.ok
                return response.json().then(errResData => {
                    const error = new Error('Something went wrong!');
                    error.data = errResData;   //找出錯誤的資料為何
                    throw error;
                });
            }
            return response.json();
        })
}

const getData = () => {
    fetch('https://reqres.in/api/users?page=2')  //get data
        .then(response => {
            console.log(response);               //transform
            return response.json();
        })
        .then(responseData => {                  //using
            console.log(responseData);
        });
};

//利用sendHttpRequest將上面的程式改寫成下面
// const getData = () => {
//     sendHttpRequest('get', 'https://reqres.in/api/users?page=2', {})
//         .then(responseData => {
//             console.log(responseData);
//         })
// };

const sendData = () => {
    sendHttpRequest('post', 'https://reqres.in/api/user', {
        "title": document.getElementById("get-title").value,  //data的格式取決於要post出去的項目格式
        "content": document.getElementById("get-content").value

    }).then(responseData => {
        console.log(responseData);
        console.log(typeof responseData);
    }).catch(err => {
        console.log(err, err.data);
    });
};

//getBtn.addEventListener('click', getData);
postBtn.addEventListener('click', sendData);

// function getValue() {
//     var content = document.getElementById("get-content").value;
//     console.log(content);
//}