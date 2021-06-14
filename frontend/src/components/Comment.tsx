//リンク先コメントを表示するやつ
import React, {useState} from "react";
import "../Comment.css";

type Props = {
    commentNumber: number
    commentTitle: string
    commentText: string
}


const Comment: React.FC<Props> = ({commentNumber, commentTitle, commentText}) => {
    return(
        <div className="comment-area" id={"c"+String(commentNumber)}>
            <div className="comment-number-area">
                コメント番号：{commentNumber}
            </div>
            <div className="comment-title-area">
                タイトル：{commentTitle}
            </div>
            <div className="comment-text-area">
                {commentText}
            </div>
        </div>
    );
}

export default Comment;