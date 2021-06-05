import requests
from bs4 import BeautifulSoup
import MeCab
import urllib

import comment

from Datastore.Comment_MongoDB import Comment_MDB


SLOTHLIB_PATH = "http://svn.sourceforge.jp/svnroot/slothlib/CSharp/Version1/SlothLib/NLP/Filter/StopWord/word/Japanese.txt"
SLOTHLIB_FILE = urllib.request.urlopen(SLOTHLIB_PATH)
SLOTHLIB_STOP_WORDS = [line.decode("utf-8").strip() for line in SLOTHLIB_FILE]
SLOTHLIB_STOP_WORDS = [ss for ss in SLOTHLIB_STOP_WORDS if not ss==u""]

StopWordJa = ["もの", "こと", "とき", "そう", "たち", "これ", "よう", "これら", "それ", "それら", "すべて", "あれ", "あれら", "どれ", "どこ"]
STOP_WORDS = list(set(SLOTHLIB_STOP_WORDS + StopWordJa))

comment_mdb = Comment_MDB()


# マップ作製
# return comment_number_length
def create_map(link):
    # dbのcollectionをリセット
    comment_mdb.reset_collection()

    title_list, comment_list = collect_comment(link)

    # Commentクラスをそれぞれ作成
    comments = []
    count = 0

    for cl in comment_list:
        c = comment.Comment(title_list[count], cl, count)
        c.make_morph()

        comments.append(c)
        
        count += 1

    
    cn = len(comment_list)

    # ループ回数に改善余地あり
    for i in range(cn):
        comment1 = comments[i]
        for j in range(cn):
            comment2 = comments[j]
            if i is not j:
                comment1.create_morph_link(comment2)

    for c in comments:
        c.create_keyword_link_list()

    # MongoDBにデータ挿入する
    comment_mdb.insert_all(comments)

    return cn


# コメント収集
# return comment_list :list
def collect_comment(link):
    
    try:
        html = requests.get(link)
        soup = BeautifulSoup(html.content, "html.parser")

        review_titles = soup.find_all("div", {"class": "reviewTitle"})
        title_list = []
        review_comments = soup.findAll("p", {"class": "revEntryCont"})
        comment_list = []

        for rt in review_titles:
            title = rt.text
            title_list.append(title)

        for rc in review_comments:
            comment = rc.text
            comment_list.append(comment)
        
        return title_list, comment_list
    
    except Exception as e:
        print("リンクが間違っているかもしれません")
        #exit(0)