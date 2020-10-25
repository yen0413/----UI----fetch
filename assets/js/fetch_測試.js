const modal_form = document.getElementById('modal_form'),
    recipient_name = document.getElementById('recipient-name'),
    message_text = document.getElementById('message-text'),
    edit_put = document.getElementById('edit-put');


let currentPost;
let currentPost_de;
let count = 0;
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
                <div id="btn_container" data-id="${tpl.fID}" style="display:">
                    <a href="localhost:44310/api/API/${tpl.fID}" id="edit${tpl.fID}" onclick="getData_edit(${tpl.fID})" data-toggle="modal" data-target="#editMessage">
                        <i class="fas fa-edit button_margin" style="color:gray" data-target="#editMessage"></i>
                    </a>
                    <a href="localhost:44310/api/API/${tpl.fID}" id="delete${tpl.fID}" data-id ="" onclick="getData_delete(${tpl.fID})" data-toggle="modal">
                        <i class="fas fa-trash button_margin" style="color:gray"></i>
                    </a> 
                    </div>
                
            </div>
               
    
            <p>第${tpl.fID}篇  文章類型 : ${tpl.fType}</p>
            <lable class="like_design">按讚數 <span class="badge badge-light" id="like${tpl.fID}">4</span></lable>             
            <p></p>
            <p id="content">${tpl.fContent}</p>
            ${tpl.picture.pic.map(p => `
                <img src="${p.pic}" class="align-self-start mr-3" style="width:330px;length:290px;border-radious:20px" alt=""></img> 
                <!--<img src="${p.pic}" class="align-self-start mr-3" style="width:330px;length:290px;border-radious:20px" alt=""></img> -->
                <!--<img src="assets/img/service/services5.jpg" class="align-self-start mr-3" style="width:330px;length:290px" alt=""></img> -->               
                `)
        }
            <p>發文時間 : ${tpl.fdate}</p>
            <div class="input-group ">
                <div class="input-group-prepend">
                        <div class="input-group-text">留言</div>
                </div>
                <input type="text" class="form-control text_mragin" id="post-Message${tpl.fID}" name="${tpl.fID}"  
                placeholder="留言......">
            </div>
            <div class="push_right">
            <button type="submit" class="btn btn-secondary button_margin"  id="post-Mbtn${tpl.fID}" onclick="sendMessageData(${tpl.fID})">留言</button>               
            <button type="submit" class="btn btn-secondary button_margin" style="width:118px;height:44px"  id="post-Likebtn${tpl.fID}" onclick="checkLike(${tpl.fID})">讚</button>    
            </div>            
            <P></P> 
            
            ${tpl.message.fmessage.map(o =>
            `           
            <div class="response_range">
                <figure>
                    <img src="assets/img/blog/頭像2.jpg" class="align-self-start mr-3" alt="...">
                    <figcaption>${o.fMName}</figcaption>
                </figure>
                <div>
                    <p>${o.fMContent}</p>
                    <p>${o.fMesTime}</p>
                </div>
                
            </div> 
            `
        ).join(" ")} 
            </div>           
        </div>
        <P></P>
    </div>
    ` ;
};

//無法用forEach?



//=============get data===============
const getData = () => {
    sendHttpRequest('get', 'https://localhost:44310/api/API')
        .then(responseData => {
            let str = '';
            responseData.ftable.forEach(i => {
                count = i.count;
                str += content_tpl(i);
            })
            $('#tpl').html(str);
            //console.log(responseData);
            // const postMessageBtn = document.getElementById('post-Mbtn');
            // postMessageBtn.addEventListener('click', sendMessageData);
        })
};

//==============delete data==============
const getData_delete = (fid) => {
    swal({
        title: "確定要刪除此篇文章?",
        //text: "Once deleted, you will not be able to recover this imaginary file!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                let UrlPutID = `https://localhost:44310/api/API/?id=${fid}`
                sendHttpRequest('delete', UrlPutID, {
                    "delete": "delete"
                }).then(responseData => {
                    console.log(responseData);
                    //console.log(typeof responseData);
                    //console.log(tpl.fID);
                    //console.log(message.fmessage);
                    request.onload = getData();
                }).catch(err => {
                    console.log(err, err.data);
                });

            } else {
                return
                //swal("Your imaginary file is safe!");
            }
        });
};

//server自動取出資料
request.onload = getData();
//=============get edit============
const getData_edit = (fid) => {
    let UrlGetID = `https://localhost:44310/api/API/${fid}`
    sendHttpRequest('get', UrlGetID)
        .then(responseData => {
            // console.log('responseData:', responseData);
            responseData.ftable.forEach(i => {

                currentPost = i;
                console.log({ currentPost });
                modal_form.setAttribute('data-id', i.fID);
                document.getElementById('recipient-name').value = i.fTitle;
                document.getElementById('message-text').value = i.fContent;
                document.getElementById('edit-put').data = i.fID;
            })

            // $('#tpl').html(str);
            // //console.log(responseData);
            // const postMessageBtn = document.getElementById('post-Mbtn');
            // postMessageBtn.addEventListener('click', sendMessageData);
        })
};
//server自動取出資料
//request.onload = getData_edit();
//request.onload = getData();


//============put edit==========
const putEditData = () => {

    // currentPost.iID
    //console.log('fid:', currentPost.fID);
    let UrlPutID = `https://localhost:44310/api/API/?id=${currentPost.fID}`
    sendHttpRequest('Put', UrlPutID, {
        "title": document.getElementById('recipient-name').value,
        "content": document.getElementById('message-text').value
    }).then(responseData => {
        console.log(document.getElementById('message-text').value);
        console.log(responseData);
        //console.log(typeof responseData);
        //console.log(tpl.fID);
        //console.log(message.fmessage);
        swal("修改成功!", "", "success");
        request.onload = getData();
    }).catch(err => {
        console.log(err, err.data);
    });

};

//=======================Post Data=========================
const sendData = () => {
    if (!document.getElementById("get-title").value) {
        swal("提醒", "請填寫標題!", "warning");
    }
    else if (!document.getElementById("get-content").value) {
        swal("提醒", "請填寫文章內容!", "warning");
    }
    else {
        sendHttpRequest('post', 'https://localhost:44310/api/API', {
            "title": document.getElementById("get-title").value,  //data的格式取決於要post出去的項目格式
            "content": document.getElementById("get-content").value,
            "pic1": document.getElementById("uploadPic").value,
        }).then(responseData => {
            //console.log(document.getElementById("uploadPic").value)
            console.log(responseData);
            //console.log(typeof responseData);
            swal({
                title: "發文成功!",
                icon: "success",
                button: "OK",
            });
            //清空輸入內容
            document.getElementById("get-title").value = "";
            document.getElementById("get-content").value = "";
            document.getElementById("img").src = "";
            //再次從server取資料
            request.onload = getData();
        }).catch(err => {
            console.log(err, err.data);
        });
    }
};

//==========================like=============================
function checkLike(fid) {
    //判斷登入的ID是否有在按讚過的fmb_ID裡面
    //有的話走put沒有的話走post
    //如何正確抓到ID?
    //if(????){
    //const addLike = (fid) => {
    //     sendHttpRequest('post', 'https://localhost:44310/api/MesLike', {
    //         "contentID": fid
    //     }).then(responseData => {
    //         console.log(responseData);
    //         //console.log(typeof responseData);
    //         //console.log(tpl.fID);
    //         request.onload = getData();
    //     }).catch(err => {
    //         console.log(err, err.data);
    //     });
    // };
    //}
    // else {
    //     const putEditData = (fid) => {
    //         let UrlPutID = `https://localhost:44310/api/MesLike/${fid}`
    //         sendHttpRequest('Put', UrlPutID, {
    //             ????????????
    //         }).then(responseData => {
    //             request.onload = getData();
    //         }).catch(err => {
    //             console.log(err, err.data);
    //         });

    //     };
    // }
}




//=======================Post Message Data=========================
const sendMessageData = (fid) => {
    let content = `post-Message${fid}`
    let UrlPutMessageID = `https://localhost:44310/api/MessageAPI/?id=${fid}`
    if (!document.getElementById(content).value) {
        swal("提醒", "請輸入留言內容!", "warning");
        return
    }
    sendHttpRequest('post', UrlPutMessageID, {
        "forumType": 4,
        "ForumID": fid,
        "content": document.getElementById(content).value
    }).then(responseData => {
        console.log(responseData);
        //console.log(typeof responseData);
        console.log(tpl.fID);
        request.onload = getData();
    }).catch(err => {
        console.log(err, err.data);
    });

};


//=======================上傳圖檔=================

$(document).on('change', '#PictureUrl', function () { //PictureUrl為input file 的id
    //console.log(this.files[0]);
    function getObjectURL(file) {
        var url = null;
        if (window.createObjcectURL != undefined) {
            url = window.createOjcectURL(file);
        } else if (window.URL != undefined) {
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) {
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }
    var objURL = getObjectURL(this.files[0]);//objURL為input file的真實路徑
    getBase64(objURL, (dataURL) => {
        //console.log(dataURL);
        document.getElementById('uploadPic').value = dataURL;
    });

    function getBase64(url, callback) {
        //通過建構函式來建立的 img 例項，在賦予 src 值後就會立刻下載圖片，相比 createElement() 建立 <img> 省去了 append()，也就避免了文件冗餘和汙染
        var Img = new Image(),
            dataURL = '';
        Img.src = url;
        Img.setAttribute("crossOrigin", 'Anonymous')
        Img.onload = function () { //要先確保圖片完整獲取到，這是個非同步事件
            var canvas = document.createElement("canvas"), //建立canvas元素
                width = Img.width, //確保canvas的尺寸和圖片一樣
                height = Img.height;
            canvas.width = width;
            canvas.height = height;
            canvas.getContext("2d").drawImage(Img, 0, 0, width, height); //將圖片繪製到canvas中
            dataURL = canvas.toDataURL('image/jpg'); //轉換圖片為dataURL
            callback ? callback(dataURL) : null; //呼叫回撥函式

        };
    }
});

//==============圖片預覽==========
const myFile = document.querySelector('#PictureUrl')

myFile.addEventListener('change', function (e) {
    const file = e.target.files[0]
    const reader = new FileReader()
    // 轉換成 DataURL
    reader.readAsDataURL(file)
    //document.querySelector("#img").style.display = "true";

    reader.onload = function () {
        // 將圖片 src 替換為 DataURL
        img.src = reader.result
    }
})

// var url = null;
// var fileObj = document.getElementById("PictureUrl").files[0];
// if (window.createObjcectURL != undefined) {
//     url = window.createOjcectURL(fileObj);
// } else if (window.URL != undefined) {
//     url = window.URL.createObjectURL(fileObj);
// } else if (window.webkitURL != undefined) {
//     url = window.webkitURL.createObjectURL(fileObj);
// }





//getBtn.addEventListener('click', getData);
postBtn.addEventListener('click', sendData);
postBtn.addEventListener('click', getData);