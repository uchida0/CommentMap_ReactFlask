from flask import Flask
from flask import url_for, redirect, render_template, request, make_response, jsonify
from flask_cors import CORS, cross_origin

import comment_map
from Datastore.Comment_MongoDB import Comment_MDB


app = Flask(__name__)
CORS(app)

@app.after_request
def after_request(response):
    response.headers.add("Access-Conrtol-Allow-Origin", "*")
    #response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
    #response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    return response


@app.route("/", methods=["GET", "POST"])
def index():
    return "index api"


@app.route("/link/map/<int:comment_number>", methods=["GET", "POST"])
def make_map(comment_number):
    #data = request.get_data()
    #print(data)
    print("make_map")
    link = request.form.get("revlink")
    word = request.form.get("keyword")
    print(link)
    print(word)

    # リンクが送られて新しくデータを収集するとき
    if link:
        comment_map.create_map(link)

        words, main_comment_title, main_comment_text, tolink_comment_title_list, tolink_comment_text_list, all_comment_num = comment_map.comment_mdb.collect_comment_map(comment_number)

        # words: str[]
        # main_comment_text: str
        # tolink_comment_text_list: str[]
        # all_comment_num: int

        map_data = {}
        map_data["keywords"] = words
        map_data["main_ctitle"] = main_comment_title
        map_data["main_ctext"] = main_comment_text
        map_data["tolink_ctitle_list"] = tolink_comment_title_list
        map_data["tolink_ctext_list"] = tolink_comment_text_list
        map_data["comment_num_sum"] = all_comment_num
        map_data["main_comment_number"] = comment_number
        #print(map_data)
        print(map_data["tolink_ctext_list"])

        return make_response(jsonify(map_data))
    
    # キーワードを変えたいとき
    elif word:
        words, main_comment_title, main_comment_text, tolink_comment_title_list, tolink_comment_text_list, all_comment_num = comment_map.comment_mdb.collect_comment_map(comment_number=comment_number, word_base=word)
        
        
        map_data = {}
        map_data["keywords"] = words
        map_data["keyword"] = word
        map_data["main_ctitle"] = main_comment_title
        map_data["main_ctext"] = main_comment_text
        map_data["tolink_ctitle_list"] = tolink_comment_title_list
        map_data["tolink_ctext_list"] = tolink_comment_text_list
        map_data["comment_num_sum"] = all_comment_num
        map_data["main_comment_number"] = comment_number
        #print(map_data)

        return make_response(jsonify(map_data))

    # メインコメントとなるコメントを変えたいとき
    elif type(comment_number) is int:
        words, main_comment_title, main_comment_text, tolink_comment_title_list, tolink_comment_text_list, all_comment_num = comment_map.comment_mdb.collect_comment_map(comment_number)

        map_data = {}
        map_data["keywords"] = words
        map_data["main_ctitle"] = main_comment_title
        map_data["main_ctext"] = main_comment_text
        map_data["tolink_ctitle_list"] = tolink_comment_title_list
        map_data["tolink_ctext_list"] = tolink_comment_text_list
        map_data["comment_num_sum"] = all_comment_num
        map_data["main_comment_number"] = comment_number
        #print(map_data)

        return make_response(jsonify(map_data))



    #print(data)

    #print(link)

    #test_data = {
        #"main_comment": {
            #"number": 0,
            #"text": "メインコメント",
            #"words":[
                #"単語１",
                #"単語２",
                #"単語３"
            #],
        #"comment":{
            #"number": 1,
            #"text": "リンク先コメント"
        #}
        #}
    #}

    #response = test_data
    #print(response)

    #return make_response(jsonify(response))


if __name__ == "__main__":
    app.debug = True
    app.run(host="127.0.0.1", port=5000)