#!/bin/bash

# チケット駆動開発用スクリプト
# 使用方法: ./scripts/ticket.sh [コマンド] [オプション]

TICKETS_DIR=".tickets"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M')
YEAR=$(date '+%Y')

# 色付き出力用
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ヘルプ表示
show_help() {
    echo "🎫 チケット駆動開発システム"
    echo ""
    echo "使用方法:"
    echo "  $0 list [状態]                    - チケット一覧表示"
    echo "  $0 show <チケット名>              - チケット詳細表示"
    echo "  $0 create <種別> <タイトル>       - 新しいチケット作成"
    echo "  $0 start <チケット名>             - チケット作業開始"
    echo "  $0 complete <チケット名>          - チケット完了"
    echo "  $0 move <チケット名> <移動先>     - チケット状態変更"
    echo "  $0 report                         - 進捗レポート表示"
    echo "  $0 search <キーワード>            - チケット検索"
    echo ""
    echo "状態: backlog, todo, in-progress, review, done"
    echo "種別: FEAT, BUG, REFACTOR"
}

# チケット一覧表示
list_tickets() {
    local status=${1:-"all"}
    
    if [ "$status" = "all" ]; then
        echo -e "${CYAN}=== 📋 全チケット一覧 ===${NC}"
        for dir in backlog todo in-progress review done; do
            echo -e "\n${YELLOW}📁 $dir${NC}"
            if [ -d "$TICKETS_DIR/$dir" ] && [ "$(ls -A $TICKETS_DIR/$dir 2>/dev/null)" ]; then
                ls -1 "$TICKETS_DIR/$dir/" | sed 's/^/  /'
            else
                echo "  (空)"
            fi
        done
    else
        echo -e "${CYAN}=== 📋 $status チケット ===${NC}"
        if [ -d "$TICKETS_DIR/$status" ] && [ "$(ls -A $TICKETS_DIR/$status 2>/dev/null)" ]; then
            ls -1 "$TICKETS_DIR/$status/"
        else
            echo "チケットがありません"
        fi
    fi
}

# チケット詳細表示
show_ticket() {
    local ticket_name="$1"
    local found_path=""
    
    # 全ディレクトリからチケットを検索
    for dir in backlog todo in-progress review done; do
        if [ -f "$TICKETS_DIR/$dir/$ticket_name" ]; then
            found_path="$TICKETS_DIR/$dir/$ticket_name"
            break
        fi
    done
    
    if [ -z "$found_path" ]; then
        echo -e "${RED}❌ チケット '$ticket_name' が見つかりません${NC}"
        return 1
    fi
    
    echo -e "${CYAN}=== 📄 チケット詳細: $ticket_name ===${NC}"
    echo -e "${YELLOW}📍 場所: $(dirname $found_path | sed 's|.tickets/||')${NC}"
    echo ""
    cat "$found_path"
}

# チケット作成
create_ticket() {
    local type="$1"
    local title="$2"
    
    if [ -z "$type" ] || [ -z "$title" ]; then
        echo -e "${RED}❌ 使用方法: $0 create <種別> <タイトル>${NC}"
        echo "種別: FEAT, BUG, REFACTOR"
        return 1
    fi
    
    # チケット番号生成
    local counter=1
    local ticket_name=""
    while true; do
        ticket_name="${type}-${YEAR}-$(printf '%03d' $counter)-${title// /-}.md"
        # 全ディレクトリで重複チェック
        local exists=false
        for dir in backlog todo in-progress review done; do
            if [ -f "$TICKETS_DIR/$dir/$ticket_name" ]; then
                exists=true
                break
            fi
        done
        if [ "$exists" = false ]; then
            break
        fi
        ((counter++))
    done
    
    # テンプレートからコピー
    local template_file="$TICKETS_DIR/templates/${type}.md"
    if [ ! -f "$template_file" ]; then
        echo -e "${RED}❌ テンプレート '$template_file' が見つかりません${NC}"
        return 1
    fi
    
    local ticket_path="$TICKETS_DIR/backlog/$ticket_name"
    cp "$template_file" "$ticket_path"
    
    # テンプレートの置換
    sed -i.bak "s/YYYY-XXX/${YEAR}-$(printf '%03d' $counter)/g" "$ticket_path"
    sed -i.bak "s/\[機能名\]/$title/g" "$ticket_path"
    sed -i.bak "s/\[バグの概要\]/$title/g" "$ticket_path"
    sed -i.bak "s/\[リファクタリング対象\]/$title/g" "$ticket_path"
    sed -i.bak "s/YYYY-MM-DD HH:MM/$TIMESTAMP/g" "$ticket_path"
    rm "$ticket_path.bak"
    
    echo -e "${GREEN}✅ チケット作成完了: $ticket_name${NC}"
    echo -e "${BLUE}📁 場所: $ticket_path${NC}"
    echo ""
    echo -e "${YELLOW}次の手順:${NC}"
    echo "1. チケット内容を編集: vim $ticket_path"
    echo "2. TODOに移動: $0 move $ticket_name todo"
    echo "3. 作業開始: $0 start $ticket_name"
}

# チケット作業開始
start_ticket() {
    local ticket_name="$1"
    
    if [ -z "$ticket_name" ]; then
        echo -e "${RED}❌ 使用方法: $0 start <チケット名>${NC}"
        return 1
    fi
    
    # todoからin-progressに移動
    if [ -f "$TICKETS_DIR/todo/$ticket_name" ]; then
        mv "$TICKETS_DIR/todo/$ticket_name" "$TICKETS_DIR/in-progress/"
        
        # 作業ログ追加
        echo "- $TIMESTAMP - 作業開始" >> "$TICKETS_DIR/in-progress/$ticket_name"
        
        echo -e "${GREEN}🚀 チケット '$ticket_name' の作業を開始しました${NC}"
        echo -e "${BLUE}📁 場所: .tickets/in-progress/$ticket_name${NC}"
    else
        echo -e "${RED}❌ チケット '$ticket_name' がtodoフォルダに見つかりません${NC}"
        echo "現在の場所を確認してください:"
        show_ticket_location "$ticket_name"
    fi
}

# チケット完了
complete_ticket() {
    local ticket_name="$1"
    
    if [ -z "$ticket_name" ]; then
        echo -e "${RED}❌ 使用方法: $0 complete <チケット名>${NC}"
        return 1
    fi
    
    # in-progressからreviewに移動
    if [ -f "$TICKETS_DIR/in-progress/$ticket_name" ]; then
        mv "$TICKETS_DIR/in-progress/$ticket_name" "$TICKETS_DIR/review/"
        
        # 作業ログ追加
        echo "- $TIMESTAMP - 作業完了（レビュー待ち）" >> "$TICKETS_DIR/review/$ticket_name"
        
        echo -e "${GREEN}🎉 チケット '$ticket_name' をレビューに回しました${NC}"
        echo -e "${BLUE}📁 場所: .tickets/review/$ticket_name${NC}"
        echo ""
        echo -e "${YELLOW}次の手順:${NC}"
        echo "1. 動作確認を実施"
        echo "2. コードレビュー"
        echo "3. 問題なければ: $0 move $ticket_name done"
    else
        echo -e "${RED}❌ チケット '$ticket_name' がin-progressフォルダに見つかりません${NC}"
        show_ticket_location "$ticket_name"
    fi
}

# チケット移動
move_ticket() {
    local ticket_name="$1"
    local target_status="$2"
    
    if [ -z "$ticket_name" ] || [ -z "$target_status" ]; then
        echo -e "${RED}❌ 使用方法: $0 move <チケット名> <移動先>${NC}"
        echo "移動先: backlog, todo, in-progress, review, done"
        return 1
    fi
    
    # 有効な状態かチェック
    case "$target_status" in
        backlog|todo|in-progress|review|done) ;;
        *)
            echo -e "${RED}❌ 無効な状態: $target_status${NC}"
            echo "有効な状態: backlog, todo, in-progress, review, done"
            return 1
            ;;
    esac
    
    # 現在の場所を検索
    local current_path=""
    local current_status=""
    for dir in backlog todo in-progress review done; do
        if [ -f "$TICKETS_DIR/$dir/$ticket_name" ]; then
            current_path="$TICKETS_DIR/$dir/$ticket_name"
            current_status="$dir"
            break
        fi
    done
    
    if [ -z "$current_path" ]; then
        echo -e "${RED}❌ チケット '$ticket_name' が見つかりません${NC}"
        return 1
    fi
    
    if [ "$current_status" = "$target_status" ]; then
        echo -e "${YELLOW}⚠️  チケットは既に $target_status にあります${NC}"
        return 0
    fi
    
    # 移動実行
    mv "$current_path" "$TICKETS_DIR/$target_status/"
    
    # 作業ログ追加
    echo "- $TIMESTAMP - $current_status → $target_status へ移動" >> "$TICKETS_DIR/$target_status/$ticket_name"
    
    echo -e "${GREEN}✅ チケット '$ticket_name' を $current_status から $target_status に移動しました${NC}"
}

# チケット場所表示
show_ticket_location() {
    local ticket_name="$1"
    
    echo -e "${CYAN}🔍 チケット '$ticket_name' の検索結果:${NC}"
    local found=false
    for dir in backlog todo in-progress review done; do
        if [ -f "$TICKETS_DIR/$dir/$ticket_name" ]; then
            echo -e "  ${GREEN}✅ $dir/$ticket_name${NC}"
            found=true
        fi
    done
    
    if [ "$found" = false ]; then
        echo -e "  ${RED}❌ チケットが見つかりません${NC}"
    fi
}

# 進捗レポート
show_report() {
    echo -e "${CYAN}=== 📊 進捗レポート ===${NC}"
    echo ""
    
    for dir in backlog todo in-progress review done; do
        local count=0
        if [ -d "$TICKETS_DIR/$dir" ]; then
            count=$(ls -1 "$TICKETS_DIR/$dir" 2>/dev/null | wc -l)
        fi
        
        local icon="📁"
        case "$dir" in
            backlog) icon="💡" ;;
            todo) icon="📋" ;;
            in-progress) icon="🚀" ;;
            review) icon="👀" ;;
            done) icon="✅" ;;
        esac
        
        echo -e "${YELLOW}$icon $dir: ${BLUE}$count${NC} チケット"
    done
    
    echo ""
    echo -e "${PURPLE}=== 🔥 進行中のチケット ===${NC}"
    if [ -d "$TICKETS_DIR/in-progress" ] && [ "$(ls -A $TICKETS_DIR/in-progress 2>/dev/null)" ]; then
        ls -1 "$TICKETS_DIR/in-progress/" | while read ticket; do
            echo -e "  ${GREEN}🚀 $ticket${NC}"
        done
    else
        echo -e "  ${YELLOW}(進行中のチケットはありません)${NC}"
    fi
}

# チケット検索
search_tickets() {
    local keyword="$1"
    
    if [ -z "$keyword" ]; then
        echo -e "${RED}❌ 使用方法: $0 search <キーワード>${NC}"
        return 1
    fi
    
    echo -e "${CYAN}=== 🔍 '$keyword' の検索結果 ===${NC}"
    
    local found=false
    for dir in backlog todo in-progress review done; do
        if [ -d "$TICKETS_DIR/$dir" ]; then
            for ticket in "$TICKETS_DIR/$dir"/*; do
                if [ -f "$ticket" ] && grep -l -i "$keyword" "$ticket" > /dev/null 2>&1; then
                    local ticket_name=$(basename "$ticket")
                    echo -e "  ${GREEN}📄 $dir/$ticket_name${NC}"
                    # マッチした行を表示（最初の3行まで）
                    grep -i -n --color=never "$keyword" "$ticket" | head -3 | sed 's/^/    /'
                    echo ""
                    found=true
                fi
            done
        fi
    done
    
    if [ "$found" = false ]; then
        echo -e "  ${YELLOW}該当するチケットが見つかりませんでした${NC}"
    fi
}

# メイン処理
case "$1" in
    "list"|"ls")
        list_tickets "$2"
        ;;
    "show"|"cat")
        show_ticket "$2"
        ;;
    "create"|"new")
        create_ticket "$2" "$3"
        ;;
    "start"|"begin")
        start_ticket "$2"
        ;;
    "complete"|"finish")
        complete_ticket "$2"
        ;;
    "move"|"mv")
        move_ticket "$2" "$3"
        ;;
    "report"|"status")
        show_report
        ;;
    "search"|"find")
        search_tickets "$2"
        ;;
    "help"|"-h"|"--help"|"")
        show_help
        ;;
    *)
        echo -e "${RED}❌ 不明なコマンド: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac