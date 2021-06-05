//メインコメントの表示部分
import axios from "axios";
import React, {useState} from "react";
import Comment from "./Comment";
import "../MainComment.css";


type Props = {
    url: string
    maincommentNumber: number
    maincommentWords: string[]
    maincommentSellectedWord: string
    maincommentTitle: string
    maincommentText: string
    setMapData: React.Dispatch<React.SetStateAction<undefined>>
    setNumOfSum: React.Dispatch<React.SetStateAction<number>>
    setMaincommentNumber: React.Dispatch<React.SetStateAction<number>>
    setMaincommentTitle: React.Dispatch<React.SetStateAction<string>>
    setMaincommentText: React.Dispatch<React.SetStateAction<string>>
    setMaincommentWords: React.Dispatch<React.SetStateAction<string[]>>
    setMaincommentSellectedWord: React.Dispatch<React.SetStateAction<string>>
    setCommentTitleList: React.Dispatch<React.SetStateAction<{[key: string]: string;}>>
    setCommentTextList: React.Dispatch<React.SetStateAction<{[key: string]: string;}>>
}


const MainComment: React.FC<Props> = ({
    url, maincommentNumber, maincommentWords, maincommentSellectedWord,
    maincommentTitle, maincommentText,
    setMapData, setNumOfSum,
    setMaincommentNumber, setMaincommentTitle, setMaincommentText,
    setMaincommentWords, setMaincommentSellectedWord,
    setCommentTitleList, setCommentTextList
    }) => {
    
    const [sellectedWord, setSellectedWord] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSellectedWord(e.target.value)
        setMaincommentSellectedWord(e.target.value)
    }

    const handleSubmit = () => {
        let postUrl: string = url + String(maincommentNumber);
        let sellectedWordData = new FormData();
        sellectedWordData.append("keyword", sellectedWord);

        axios.post(postUrl, sellectedWordData, {headers:{"Access-Control-Allow-Origin": "http://127.0.0.1:5000"}})
        .then(res => {
            console.log(res);
            console.log(res.data);

            let mapData = res.data;
            console.log(mapData.comment_title_list);
            console.log(mapData.comment_text_list);
            setMapData(mapData);

            parseMapData(mapData);
        })
    }

    const parseMapData = (mapData: any) => {
        let comment_num_sum = mapData.comment_num_sum;
        console.log(comment_num_sum);
        setNumOfSum(comment_num_sum);

        let maincomment_number = mapData.main_comment_number;
        console.log(maincomment_number);
        setMaincommentNumber(maincomment_number);
        let maincomment_title = mapData.main_ctitle;
        console.log(maincomment_title);
        setMaincommentTitle(maincomment_title);
        let maincomment_text = mapData.main_ctext;
        console.log(maincomment_text);
        setMaincommentText(maincomment_text);
        
        let maincomment_words = mapData.keywords;
        console.log(maincomment_words);
        setMaincommentWords(maincomment_words);

        let maincomment_sellected_word = mapData.keyword
        console.log(maincomment_sellected_word);
        setMaincommentSellectedWord(maincomment_sellected_word)

        let comment_title_list = mapData.tolink_ctitle_list;

        console.log(comment_title_list);
        setCommentTitleList(comment_title_list);
        let comment_text_list = mapData.tolink_ctext_list;
        console.log(comment_text_list);
        setCommentTextList(comment_text_list);
    }

    /*
    const makeWordRadiobutton = () => {
        let radiobuttons = [];
        for (let i=0; i < maincommentWords.length; i++){
            radiobuttons.push(
            <input type="radio" value={maincommentWords[i]} onChange={handleChange} checked={maincommentWords[i] === sellectedWord}></input>
            );
        }
        return radiobuttons;
    }
    */

    return(
        <div className="maincomment-area">
            <Comment commentNumber={maincommentNumber} commentTitle={maincommentTitle} commentText={maincommentText}/>
            <div className="words-area">
                <div className="radio-btn-label">キーワードリスト</div>
                {(() => {
                    let radiobuttons = [];
                    for (let i=0; i<maincommentWords.length; i++){
                        radiobuttons.push(
                            <label htmlFor={String(i)}>
                            <input type="radio" id={String(i)} value={maincommentWords[i]} onChange={handleChange} checked={maincommentWords[i] === sellectedWord}></input>
                            {maincommentWords[i]}
                            </label>
                        
                            
                        );
                    }
                        return radiobuttons;
                    
                })()}
            </div>
            <div>
                <button className="btn-word" onClick={handleSubmit}>キーワード決定</button>
            </div>
        </div>
    );
}

export default MainComment;