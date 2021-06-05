//商品レビューリンクをinputするやつ
import React, {useState} from "react";
//import "whatwg-fetch";
import axios from "axios";
//import LeaderLine from "react-leader-line";



type Props = {
    url: string
    setUrl: React.Dispatch<React.SetStateAction<string>>
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


const LinkInput: React.FC<Props> = ({
    url, setUrl, setMapData,
    setNumOfSum, setMaincommentNumber, setMaincommentTitle, setMaincommentText,
    setMaincommentWords, setMaincommentSellectedWord,
    setCommentTitleList, setCommentTextList
    }) => {

    const [inputLink, setInputLink] = useState("");
    //const [mapData, setMapData] = useState("")
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputLink(e.target.value);
    }

    const handleSubmit = () => {
        //fetch or axios POST
        // axiosで良さそう
        let postUrl: string = url;
        let linkData = new FormData();

        linkData.append("revlink", inputLink);
        //console.log(postUrl);
        //console.log(inputLink);
        console.log(linkData.get("revlink"));

        axios.post(postUrl, linkData, {headers:{"Access-Control-Allow-Origin": "http://127.0.0.1:5000"}})
        .then(res => {
            console.log(res);
            console.log(res.data);
            //Map生成に必要なデータを全て受け取る
            //setMapData(res.data)
            let mapData = res.data;
            console.log(typeof(mapData.tolink_ctitle_list));
            let comment_title_list = mapData.tolink_ctitle_list
            console.log(mapData.tolink_ctext_list);
            for(let key in  comment_title_list){
                console.log(typeof(key))
                console.log(typeof(comment_title_list[key]))
            }
            setMapData(mapData);

            parseMapData(mapData);
        })
    }

    
    // 親コンポーネントにparseしてセットする
    const parseMapData = (mapData:any) => {
        let comment_num_sum = mapData.comment_num_sum;
        setNumOfSum(comment_num_sum);
        
        let maincomment_number = mapData.main_comment_number;
        setMaincommentNumber(maincomment_number);
        let maincomment_title = mapData.main_ctitle;
        setMaincommentTitle(maincomment_title);
        let maincomment_text = mapData.main_ctext;
        setMaincommentText(maincomment_text);

        let maincomment_words = mapData.keywords;
        setMaincommentWords(maincomment_words);
        // MaincommentSellectedWord は最初のキーワードを設定する
        let maincomment_sellected_word = mapData.keywords[0];
        setMaincommentSellectedWord(maincomment_sellected_word);

        let comment_title_list = mapData.tolink_ctitle_list;
        setCommentTitleList(comment_title_list);
        let comment_text_list = mapData.tolink_ctext_list;
        setCommentTextList(comment_text_list);
    }

    //Map生成に必要なデータの受け渡し
    //const getMapData = () => {
        //return mapData
    //}

    return(
        <div className="input-form">
                価格.comの商品レビューのリンクを入力してください。<br/>
                <form className="input-link">
                <input
                type="text"
                className="input"
                value={inputLink}
                onChange={handleInputChange}
                name="revlink"
                >
                </input>
                </form>
                <button className="btn-create" value={url} onClick={handleSubmit}>マップ生成</button>
        </div>
    );
}

export default LinkInput;