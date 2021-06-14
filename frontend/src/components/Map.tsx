//MainCommentとCommentをマップにして表示するやつ
import React, {useEffect, useState} from "react";
import LinkInput from "./LinkInput";
import MainComment from "./MainComment";
import Comment from "./Comment";
import SellectComment from "./SellectComment";
import "../Map.css";
//import LeaderLine from "react-leader-line";
import LeaderLine from "leader-line-new";


const Map: React.FC = () => {
    const [url, setUrl] = useState("")
    const [mapData, setMapData] = useState()
    // 子コンポーネントでmapDataを取得して更新していく
    // 最初はLinkInputのみ表示 => mapDataに値があれば他のコンポーネントを表示

    const initialObject: {[key:string] : string } = {"": ""}

    //mapData分解用
    const [commentNumSum, setNumOfSum] = useState(1)
    const [maincommentNumber, setMaincommentNumber] = useState(0)
    const [maincommentTitle, setMaincommentTitle] = useState("")
    const [maincommentText, setMaincommentText] = useState("")
    const [maincommentWords, setMaincommentWords] = useState([""])
    const [maincommentSellectedWord, setMaincommentSellectedWord] = useState("")
    const [commentTitleList, setCommentTitleList] = useState(initialObject)
    const [commentTextList, setCommentTextList] = useState(initialObject)

    const initialLinks: LeaderLine[] = []
    const [links, setLinks] = useState(initialLinks)


    /*
    const ToComments = () => {
        let comments = [];
        for (let [key, value] of commentTitleList){
            comments.push(
                <Comment commentNumber={key} commentTitle={value} commentText={maincommentText[key]} />
            );
        }
        return comments;
    }
    */
    let link: LeaderLine[] = []

    useEffect(()=>{
        //console.log(links.length)
        if (links.length > 0){
            console.log("links_lenght not 0")
            links.filter(l => {
                l.remove()
            })
        }

        for (let key in commentTitleList){
            let s = document.getElementById("c"+String(maincommentNumber))!;
            let e = document.getElementById("c"+String(key))!;
            //console.log(s)
            //console.log(e)
            if(s  && e){
                link.push(
                    new LeaderLine(s,e,{startSocket:"right", endSocket:"left"})
                    )
            }
           }
           setLinks(link)
           console.log("linkの状態")
           console.log(link)
        
    },[maincommentNumber, maincommentSellectedWord,commentTitleList,]);





    return(
        <div>
            <LinkInput url="http://127.0.0.1:5000/link/map/0"
            setUrl={setUrl} setMapData={setMapData}
            setNumOfSum={setNumOfSum} setMaincommentNumber={setMaincommentNumber}
            setMaincommentTitle={setMaincommentTitle} setMaincommentText={setMaincommentText}
            setMaincommentWords={setMaincommentWords} setMaincommentSellectedWord={setMaincommentSellectedWord}
            setCommentTitleList={setCommentTitleList} setCommentTextList={setCommentTextList}
            />
            {
                mapData ? 
                <div>
                <SellectComment url="http://127.0.0.1:5000/link/map/"
                commentNum={commentNumSum} setMapData={setMapData}
                setNumOfSum={setNumOfSum} setMaincommentNumber={setMaincommentNumber}
                setMaincommentTitle={setMaincommentTitle} setMaincommentText={setMaincommentText}
                setMaincommentWords={setMaincommentWords} setMaincommentSellectedWord={setMaincommentSellectedWord}
                setCommentTitleList={setCommentTitleList} setCommentTextList={setCommentTextList}
                />
                <div className="comment-map-area">
                <div className="main-comment">
                <h3>メインコメント</h3>
                <MainComment url="http://127.0.0.1:5000/link/map/"
                maincommentNumber={maincommentNumber}
                maincommentWords={maincommentWords} maincommentSellectedWord={maincommentSellectedWord}
                maincommentTitle={maincommentTitle} maincommentText={maincommentText}
                setMapData={setMapData}
                setNumOfSum={setNumOfSum} setMaincommentNumber={setMaincommentNumber}
                setMaincommentTitle={setMaincommentTitle} setMaincommentText={setMaincommentText}
                setMaincommentWords={setMaincommentWords} setMaincommentSellectedWord={setMaincommentSellectedWord}
                setCommentTitleList={setCommentTitleList} setCommentTextList={setCommentTextList}
                />
                </div>
                <div className="comments">
                <h3>リンク先コメント</h3>
                {(() =>{
                    let comments = [];
                    for (let key in commentTitleList){
                        comments.push(
                            <div className="one-comment">
                            <Comment commentNumber={Number(key)} commentTitle={commentTitleList[key]} commentText={commentTextList[key]} />
                            </div>
                        );
                    }
                    return comments;
                })()}
                </div>
                </div>

                </div>

                :
                <div>
                </div>
            }
        </div>
    );
}

export default Map;