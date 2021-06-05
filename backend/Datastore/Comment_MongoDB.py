from pymongo import MongoClient

class Comment_MDB:

    def __init__(self):
        self.client = MongoClient()
        self.db = self.client["KCmap"]
        self.col = self.db["test"]


    #commentオブジェクトリストを受け取ってデータ挿入
    def insert_all(self, comments):
        for comment in comments:
            c = comment.__dict__
            cm_list = []
            for cm in c["morph_list"]:
                cm_list.append(cm.__dict__)

            c["morph_list"] = cm_list

            self.col.insert(c)


    #commentをmap基準で返す
    # haslink_word_base_list: list
    # main_comment_text: str
    # tolink_comment_text_list: list
    # all_comment_num :int
    def collect_comment_map(self, comment_number, word_base=None):
        main_comment = self.col.find_one( filter={"comment_number": comment_number} )
        #print(main_comment)

        #haslink_word_base_listからリンク先コメント番号取得
        tolink_list = main_comment["haslink_word_base_list"]
        haslink_word_base_list = list(tolink_list.keys())

        if word_base is None:
            word_base = haslink_word_base_list[0]

        tolink_list = tolink_list[word_base]

        main_comment_title = main_comment["title"]

        main_comment_text = main_comment["comment"]
        main_comment_text = main_comment_text.replace(word_base, "<mark>"+word_base+"</mark>")

        tolink_comment_title_list = {}
        tolink_comment_text_list = {}

        for tolink in tolink_list:
            title, text = self.coloring_comment_text(comment_number=tolink, word=word_base)
            tolink_comment_title_list[tolink] = title
            tolink_comment_text_list[tolink] = text
        
    


        #collection内データ件数取得
        all_comment_num = self.col.estimated_document_count()

        return haslink_word_base_list, main_comment_title, main_comment_text, tolink_comment_title_list, tolink_comment_text_list, all_comment_num


    #htmlコードを挟む
    #<mark></mark>
    def coloring_comment_text(self, comment_number, word):
        comment = self.col.find_one(filter={"comment_number": comment_number})
        comment_text = comment["comment"]

        comment_text = comment_text.replace(word, "<mark>"+word+"</mark>")

        comment_title = comment["title"]

        return comment_title, comment_text


    #１回の検索ごとにコレクション削除を現状は採用
    def reset_collection(self):
        self.col.drop()
