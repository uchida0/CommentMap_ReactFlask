import axios from "axios";
import React, {useState} from "react";

type Props = {
    url: string
    commentNum: number
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

const SellectComment: React.FC<Props> = ({
    url, commentNum, setMapData, setNumOfSum,
    setMaincommentNumber, setMaincommentTitle, setMaincommentText,
    setMaincommentWords, setMaincommentSellectedWord,
    setCommentTitleList, setCommentTextList
    }) => {

    // 新しく呼び出されるたびに値はどうなるか
    const [sellectedNum, setSellectedNum] = useState(0)

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        //改善余地あり
        setSellectedNum(Number(e.target.value));
    }

    const handleSubmit = () => {
        // postUrl末尾に選択されたコメント番号を追加する
        let postUrl: string = url + String(sellectedNum);
        let sellectedNumData = new FormData();
        sellectedNumData.append("comment_number", String(sellectedNum));

        axios.post(postUrl, sellectedNumData, {headers:{"Access-Control-Allow-Origin": "http://127.0.0.1:5000"}})
        .then(res => {
            console.log(res);
            console.log(res.data);

            let mapData = res.data;
            setMapData(mapData);

            parseMapData(mapData);
        })


    }

    const parseMapData = (mapData: any) => {
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
        // MaincommentSellectedWordは最初のキーワードを設定する
        let maincomment_sellected_word = mapData.keywords[0]
        setMaincommentSellectedWord(maincomment_sellected_word)

        let comment_title_list = mapData.tolink_ctitle_list;
        setCommentTitleList(comment_title_list);
        let comment_text_list = mapData.tolink_ctext_list;
        setCommentTextList(comment_text_list);
    }

    /*
    const makeOptions = () => {
        let options = [];
        for (let i=0; i<commentNum; i++){
            options.push(<option value={i}>コメント{i}</option>);
        }
        return options;
    }
    */
    
    
    return(
        <div className="sellect-number-area">
            <form className="sellect-number">
                <select value={sellectedNum} onChange={handleChange}>
                    {(() => {
                        let options = [];
                        for (let i=0; i<commentNum; i++){
                        options.push(<option value={i}>コメント{i}</option>);
                        }
                        return options;
                    })()}
                </select>
            </form>
            <button className="btn-sellect"  onClick={handleSubmit}>コメント番号決定</button>
        </div>
    );
    
    
}

export default SellectComment;