import MeCab
import stopwords
import comment
import re

stop_words = stopwords.STOP_WORDS
re_hiragana = re.compile(r"[あ-ん]")


class Morph:

    def __init__(self, word_surf, word_base, pos, comment_number):
        self.word_surf = word_surf
        self.word_base = word_base
        self.pos = pos
        self.comment_number = comment_number
        # selectedは取り扱うかどうかの判定用
        self.sellected = False

        self.link_list = []


    # どの語を取り扱うのか
    def sellect_word(self):
        if self.pos == "名詞":
            if not re_hiragana.fullmatch(self.word_base):
                if self.word_base is not "*" and self.word_base not in stop_words:
                    self.sellected = True

    
    #他コメントのリンク先コメント番号を検索
    def create_link(self, other_comment):
        if self.sellected:
            if self.word_base in other_comment.sellected_word_base_list:
                self.link_list.append(other_comment.comment_number)