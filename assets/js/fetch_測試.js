//const getBtn = document.getElementById('get-btn');
const postBtn = document.getElementById('post-btn');
const request = new XMLHttpRequest();

const sendHttpRequest = (method, url, data) => {  //fetch的上半部整理成function
    return fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: data ? { 'Content-Type': 'application/json' } : {} //{}裡面可放物件//三元表達式
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

//------get template-------
const content_tpl = tpl => {
    return ` 
    <div class="media main_BCC">
        <figure class="figure_range">
            <img src="assets/img/blog/匿名頭像1.jpg" class="align-self-start mr-3" alt="...">
            <figcaption>${tpl.fName}</figcaption>
        </figure>
        <div class="media-body">
            <div class="icon_right">
                <h5 class="mt-0" id="title">標題 : ${tpl.fTitle}</h5>
                
                <a href="localhost:44310/api/API/${tpl.fID}" data-id="${tpl.fID}" data-toggle="modal" data-target="#editMessage">
                    <i class="fas fa-edit button_margin" style="color:gray" data-target="#editMessage"></i>
                </a>
     
                
            </div>
        </div>        
    </div>
            <p>第${tpl.fID}篇  文章類型 : ${tpl.fType}</p>             
            <p></p>
            <p id="content">${tpl.fContent}</p>
            <div class="input-group ">
            <div class="input-group-prepend">
                <div class="input-group-text">留言</div>
            </div>
            <input type="text" class="form-control text_mragin" id="${tpl.fID}" name="${tpl.fID}" placeholder="留言......">
            </div>
            <p></p>
            <div class="push_right">
                <button type="submit" class="btn btn-secondary button_margin" id="post-Mbtn">留言</button>
                <!-- <button type="submit" class="btn btn-secondary button_margin">加入圖片</button> -->
            </div>
            <P></P> 
            
            ${tpl.message.fmessage.map(o =>
        `           
            <div class="response_range">
                <figure>
                    <img src="assets/img/blog/頭像2.jpg" class="align-self-start mr-3" alt="...">
                    <figcaption>${o.fMName}</figcaption>
                </figure>
                <p>${o.fMContent}</p>
            </div>           
            `
    ).join(" ")} 
        </div>
    </div>
    <P></P>
    
    ` ;
};
//無法用forEach?

//------edit template------
// function openwin() {
//     window.open("https://gank.io/api", "", "height=100, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
// }


const getData = () => {
    sendHttpRequest('get', 'https://localhost:44310/api/API')
        .then(responseData => {
            let str = '';
            responseData.ftable.forEach(i => {
                str += content_tpl(i);
            })
            $('#tpl').html(str);
            //console.log(responseData);
            const postMessageBtn = document.getElementById('post-Mbtn');
            postMessageBtn.addEventListener('click', sendMessageData);
        })
};
//server自動取出資料
request.onload = getData();

const sendData = () => {
    if (!document.getElementById("get-title").value) {
        alert('請填入標題!');
    }
    else if (!document.getElementById("get-content").value) {
        alert('請填入內容!');
    }
    else {
        sendHttpRequest('post', 'https://localhost:44310/api/API', {
            "title": document.getElementById("get-title").value,  //data的格式取決於要post出去的項目格式
            "content": document.getElementById("get-content").value

        }).then(responseData => {
            console.log(responseData);
            console.log(typeof responseData);
            //再次從server取資料
            request.onload = getData();
        }).catch(err => {
            console.log(err, err.data);
        });
    }
};



//==================TODO==================字串裡塞變數????    後端需加接message的程式碼
//post message data
const url = `https://localhost:44310/api/API/?id=${id}`
const sendMessageData = () => {
    sendHttpRequest('post', 'url', {
        "id": tpl.fID,
        "message.fmessage": document.getElementById('${tpl.fID}').value

    }).then(responseData => {
        console.log(responseData);
        //console.log(typeof responseData);
        console.log(tpl.fID);
        console.log(message.fmessage);
        request.onload = getData();
    }).catch(err => {
        console.log(err, err.data);
    });

};


//getBtn.addEventListener('click', getData);
postBtn.addEventListener('click', sendData);
postBtn.addEventListener('click', getData);
// function getValue() {
//     var content = document.getElementById("get-content").value;
//     console.log(content);
//}