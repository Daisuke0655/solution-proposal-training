"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    MessageCircle,
    Heart,
    Zap,
    PlusCircle,
    List,
    Users,
    Tag,
    Loader2,
    AlertTriangle,
    Eye,
    UserPlus,
    CheckCircle,
    Coffee, // カジュアルな相談
    Briefcase, // 業務相談
    HandHelping, // 支援
    Megaphone, // 告知
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// ===============================
// Types & Interfaces (削除されました)
// ===============================

// ===============================
// Constants
// ===============================

const REACTION_TYPES = ['わかる', '自分もそうでした', '応援しています'];
const POST_CATEGORIES = ['相談', '雑談', '支援', '告知']; // 相談カテゴリ

// アニメーションのバリアント
const postVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

// ===============================
// Dummy Data & API (for MVP)
// ===============================

// 投稿データ（モック）
let initialPosts = [
    {
        id: '1',
        content: '最近、チーム内のコミュニケーションがうまくいかなくて悩んでいます。リモートワークが中心になって、気軽に相談できる人が減ってしまったのが原因かもしれません。',
        tags: ['コミュニケーション', 'リモートワーク', 'チーム'],
        reactions: { 'わかる': 3, '自分もそうでした': 1, '応援しています': 5 },
        createdAt: Date.now() - 1000 * 60 * 60 * 2,
        author: 'anonymous123',
        authorName: '山田太郎',
        isResolved: false,
        viewCount: 25,
        category: '相談',
    },
    {
        id: '2',
        content: '新しいプロジェクトがスタートしましたが、目標設定が曖昧で、何から手をつければいいのか分からず不安です。同じような経験をした方、いらっしゃいますか？',
        tags: ['プロジェクト', '目標設定', '不安'],
        reactions: { 'わかる': 8, '自分もそうでした': 6, '応援しています': 2 },
        createdAt: Date.now() - 1000 * 60 * 60 * 12,
        author: 'anonymous456',
        authorName: '佐藤花子',
        isResolved: true,
        viewCount: 102,
        category: '相談',
    },
    {
        id: '3',
        content: '上司からのフィードバックが抽象的で、具体的にどう改善すればいいのか悩んでいます。「もっと成長してほしい」と言われるのですが、何をすれば成長になるのでしょうか？',
        tags: ['フィードバック', '成長', 'キャリア'],
        reactions: { 'わかる': 2, '自分もそうでした': 2, '応援しています': 1 },
        createdAt: Date.now() - 1000 * 60 * 30,
        author: 'anonymous789',
        authorName: '田中一郎',
        isResolved: false,
        viewCount: 15,
        category: '相談',
    },
    {
        id: '4',
        content: '今週の金曜日にチームでランチに行きませんか？',
        tags: ['ランチ', 'チーム'],
        reactions: { 'いいね': 5, '参加したい': 3 },
        createdAt: Date.now() - 1000 * 60 * 60 * 24,
        author: 'anonymous222',
        authorName: '鈴木次郎',
        isResolved: false,
        viewCount: 30,
        category: '雑談',
    },
    {
        id: '5',
        content: '新しい技術に関する勉強会を開催します！',
        tags: ['勉強会', '技術'],
        reactions: { '興味あり': 10, '参加します': 7 },
        createdAt: Date.now() - 1000 * 60 * 60 * 48,
        author: 'anonymous999',
        authorName: '高橋美咲',
        isResolved: false,
        viewCount: 80,
        category: '告知',
    },
    {
        id: '6',
        content: '〇〇の件で困っています。どなたかご支援いただけないでしょうか？',
        tags: ['〇〇', '支援'],
        reactions: { '手伝います': 2, '情報提供します': 1 },
        createdAt: Date.now() - 1000 * 60 * 60,
        author: 'anonymous555',
        authorName: '渡辺健太',
        isResolved: false,
        viewCount: 12,
        category: '支援',
    },
];

// モックAPI関数
const mockApi = {
    getPosts: async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return initialPosts;
    },
    createPost: async (newPost, isAnonymous, category) => {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const id = crypto.randomUUID();
        const authorName = isAnonymous ? `anonymous${Math.floor(Math.random() * 10000)}` : '山田太郎'; // 仮の名前
        const post = {
            ...newPost,
            id,
            reactions: {},
            createdAt: Date.now(),
            author: `anonymous${Math.floor(Math.random() * 10000)}`,
            authorName: isAnonymous ? undefined : authorName,
            isResolved: false,
            viewCount: 0,
            category,
        };
        initialPosts = [post, ...initialPosts];
        return post;
    },
    addReaction: async (postId, reaction) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const post = initialPosts.find((p) => p.id === postId);
        if (post) {
            post.reactions[reaction] = (post.reactions[reaction] || 0) + 1;
        } else {
            throw new Error('Post not found');
        }
    },
    markAsResolved: async (postId) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const post = initialPosts.find(p => p.id === postId);
        if (post) {
            post.isResolved = true;
        } else {
            throw new Error("Post not found");
        }
    },
    incrementViewCount: async (postId) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const post = initialPosts.find((p) => p.id === postId);
        if (post) {
            post.viewCount += 1;
        }
    },
    getPostsByCategory: async (category) => {
        await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network latency
        return initialPosts.filter(post => post.category === category);
    },
};

// ===============================
// Components
// ===============================

/**
 * 投稿カード
 */
const PostCard = ({ post, onReaction, onMarkAsResolved, onViewPost }) => {
    const [isReacting, setIsReacting] = useState(false);

    const handleReaction = async (reactionType) => { // 引数名を reaction から reactionType に変更（スコープ内の変数名と衝突するため）
        if (isReacting) return;
        setIsReacting(true);
        try {
            await onReaction(post.id, reactionType);
        } catch (error) {
            console.error('Failed to add reaction:', error);
        } finally {
            setIsReacting(false);
        }
    };

    const handleView = () => {
        onViewPost(post.id);
    }

    const getCategoryIcon = (category) => {
        switch (category) {
            case '相談':
                return <Briefcase className="w-4 h-4" />;
            case '雑談':
                return <Coffee className="w-4 h-4" />;
            case '支援':
                return <HandHelping className="w-4 h-4" />;
            case '告知':
                return <Megaphone className="w-4 h-4" />;
            default:
                return <MessageCircle className="w-4 h-4" />;
        }
    };

    return (
        <motion.div
            variants={postVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <Card className="mb-4 shadow-md hover:shadow-lg transition-shadow group">
                <CardHeader onClick={handleView} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                        {getCategoryIcon(post.category)}
                        <span className="text-sm font-medium text-gray-700">
                            {post.authorName ? post.authorName : '匿名さん'}
                        </span>
                        <span className="text-xs text-gray-500">
                            {new Date(post.createdAt).toLocaleString('ja-JP', {
                                hour: 'numeric',
                                minute: 'numeric',
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                            })}
                        </span>
                        {post.isResolved && (
                            <Badge variant="success" className="ml-2 text-xs flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                解決済み
                            </Badge>
                        )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-4 h-4 text-gray-500" />
                    </div>
                </CardHeader>
                <CardContent onClick={handleView} className="cursor-pointer">
                    <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
                    <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>閲覧数: {post.viewCount}</span>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2 justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                        {REACTION_TYPES.map((reaction) => (
                            <Button
                                key={reaction}
                                variant="outline"
                                size="sm"
                                onClick={() => handleReaction(reaction)} // 修正: post.id は不要、直接 reaction を渡す
                                disabled={isReacting}
                                className={cn(
                                    "flex items-center gap-1",
                                    "hover:bg-gray-100",
                                    isReacting && "opacity-70 cursor-not-allowed"
                                )}
                            >
                                {reaction === 'わかる' && <Heart className="w-4 h-4" />}
                                {reaction === '自分もそうでした' && <Users className="w-4 h-4" />}
                                {reaction === '応援しています' && <Zap className="w-4 h-4" />}
                                <span>{reaction}（{post.reactions[reaction] || 0}）</span>
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onMarkAsResolved(post.id)}
                        className={cn(
                            "text-green-500 hover:text-green-600 hover:bg-green-50 transition-colors",
                            post.isResolved && "opacity-50 cursor-not-allowed"
                        )}
                        disabled={post.isResolved}
                    >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        解決済みにする
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

/**
 * 投稿フォーム
 */
const PostForm = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [error, setError] = useState(null);
    const [isAnonymous, setIsAnonymous] = useState(true);
    const [category, setCategory] = useState('相談'); // デフォルトを「相談」とする

    const handlePost = async () => {
        if (!content.trim()) {
            setError('投稿内容を入力してください。');
            return;
        }
        if (isPosting) return;
        setIsPosting(true);
        setError(null);
        try {
            const post = { content, tags };
            await onPostCreated(post, isAnonymous, category);
            setContent('');
            setTags([]);
            setNewTag('');
            setIsAnonymous(true);
            setCategory('相談');
        } catch (err) {
            setError(`投稿に失敗しました: ${err.message || '不明なエラー'}`);
        } finally {
            setIsPosting(false);
        }
    };

    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case '相談':
                return <Briefcase className="w-4 h-4" />;
            case '雑談':
                return <Coffee className="w-4 h-4" />;
            case '支援':
                return <HandHelping className="w-4 h-4" />;
            case '告知':
                return <Megaphone className="w-4 h-4" />;
            default:
                return <MessageCircle className="w-4 h-4" />;
        }
    };

    return (
        <Card className="mb-6 shadow-md">
            <CardHeader>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-blue-500" />
                    悩みを投稿する
                </h2>
            </CardHeader>
            <CardContent>
                <Textarea
                    placeholder="抱えている悩みや困っていることを共有しましょう..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mb-4"
                    rows={4}
                    disabled={isPosting}
                />
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Tag className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">タグ</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs flex items-center gap-1"
                            >
                                {tag}
                                <button
                                    onClick={() => handleRemoveTag(tag)}
                                    className="ml-1 text-xs hover:text-gray-400"
                                >
                                    ×
                                </button>
                            </Badge>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <Input
                            type="text"
                            placeholder="タグを追加..."
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            className="w-40 text-sm"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddTag();
                                }
                            }}
                            disabled={isPosting}
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAddTag}
                            disabled={isPosting}
                            className="text-sm"
                        >
                            追加
                        </Button>
                    </div>
                </div>
                <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700 mr-2">投稿カテゴリ:</span>
                    <Select onValueChange={(value) => setCategory(value)} value={category}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            {POST_CATEGORIES.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    <span className="flex items-center gap-1.5">
                                        {getCategoryIcon(cat)}
                                        {cat}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700">投稿設定:</span>
                    <Select onValueChange={(value) => setIsAnonymous(value === 'anonymous')} value={isAnonymous ? 'anonymous' : 'realname'}>
                        <SelectTrigger className="w-[180px] ml-2">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="anonymous">
                                <span className="flex items-center gap-1.5">
                                    <Eye className="w-3.5 h-3.5" />
                                    匿名で投稿
                                </span>
                            </SelectItem>
                            <SelectItem value="realname">
                                <span className="flex items-center gap-1.5">
                                    <UserPlus className="w-3.5 h-3.5" />
                                    実名で投稿
                                </span>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {error && (
                    <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded relative" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                        <AlertTriangle className="absolute top-2.5 left-4 h-5 w-5 text-red-500" />
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button
                    onClick={handlePost}
                    disabled={isPosting}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                >
                    {isPosting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            投稿中...
                        </>
                    ) : (
                        '投稿する'
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
};

/**
 * メインコンポーネント
 */
const ZenGoApp = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('すべて');


    // 投稿一覧取得
    const fetchPosts = useCallback(async (category) => {
        setLoading(true);
        setError(null);
        try {
            let fetchedPosts;
            if (category === 'すべて') {
                fetchedPosts = await mockApi.getPosts();
            } else {
                fetchedPosts = await mockApi.getPostsByCategory(category);
            }
            setPosts(fetchedPosts);
        } catch (err) {
            setError(`投稿の取得に失敗しました: ${err.message || '不明なエラー'}`);
        } finally {
            setLoading(false);
        }
    }, []);

    // 初期データ取得
    useEffect(() => {
        fetchPosts('すべて');
    }, [fetchPosts]);

    // カテゴリー変更時の処理
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        fetchPosts(category);
    };

    // 投稿作成
    const handlePostCreated = async (newPost, isAnonymous, category) => {
        try {
            const createdPost = await mockApi.createPost(newPost, isAnonymous, category);
            // setPosts((prevPosts) => [createdPost, ...prevPosts]); // 以下の fetchPosts で更新されるので不要な場合がある
            if (selectedCategory === 'すべて' || selectedCategory === category) {
                fetchPosts(selectedCategory); // リロードして最新の状態を表示
            } else {
                // 選択中のカテゴリと異なるカテゴリに投稿した場合、現在のリストには追加せず、
                // そのカテゴリが選択された時に表示されるようにする (fetchPostsが呼ばれるため)
                // 必要であれば、ここで setPosts((prevPosts) => [createdPost, ...prevPosts]); を行い、
                // ユーザーに即時フィードバックを与えることも検討できます。
                // ただし、その場合、現在のフィルタリングと矛盾する可能性があります。
                // 今回は fetchPosts に任せる形とします。
            }
        } catch (error) {
            console.error('Failed to create post:', error);
            setError(`投稿に失敗しました: ${error.message || '不明なエラー'}`);
        }
    };

    // リアクション追加
    const handleReaction = async (postId, reaction) => {
        try {
            await mockApi.addReaction(postId, reaction);
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId
                        ? {
                            ...post,
                            reactions: {
                                ...post.reactions,
                                [reaction]: (post.reactions[reaction] || 0) + 1
                            }
                        }
                        : post
                )
            );
        } catch (error) {
            console.error('Failed to add reaction:', error);
            setError(`リアクションに失敗しました: ${error.message || '不明なエラー'}`);
            // エラー発生時にリストを再フェッチして整合性を保つ
            await fetchPosts(selectedCategory);
        }
    };

    const handleMarkAsResolved = async (postId) => {
        try {
            await mockApi.markAsResolved(postId);
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId ? { ...post, isResolved: true } : post
                )
            );
        } catch (error) {
            console.error("Failed to mark as resolved", error);
            setError("解決済みにできませんでした。");
        }
    };

    const handleViewPost = async (postId) => {
        try {
            await mockApi.incrementViewCount(postId);
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId ? { ...post, viewCount: post.viewCount + 1 } : post
                )
            );
        } catch (error) {
            console.error("Failed to increment view count", error);
            setError("閲覧数を更新できませんでした。");
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case '相談':
                return <Briefcase className="w-5 h-5" />;
            case '雑談':
                return <Coffee className="w-5 h-5" />;
            case '支援':
                return <HandHelping className="w-5 h-5" />;
            case '告知':
                return <Megaphone className="w-5 h-5" />;
            case 'すべて':
                return <List className="w-5 h-5" />;
            default:
                return <MessageCircle className="w-5 h-5" />;
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-3">
                <Users className="w-8 h-8 text-indigo-500" />
                社内版ZenGo
            </h1>
            <PostForm onPostCreated={handlePostCreated} />
            <div className="mb-4">
                <span className="text-sm font-medium text-gray-700 mr-2">カテゴリ:</span>
                <Select onValueChange={handleCategoryChange} value={selectedCategory}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="すべて">
                            <span className="flex items-center gap-1.5">
                                {getCategoryIcon('すべて')}
                                すべて
                            </span>
                        </SelectItem>
                        {POST_CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                <span className="flex items-center gap-1.5">
                                    {getCategoryIcon(cat)}
                                    {cat}
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {loading ? (
                <div className="text-center py-8">
                    <Loader2 className="animate-spin w-8 h-8 mx-auto text-gray-500" />
                    <p className="mt-2 text-gray-500">Loading posts...</p>
                </div>
            ) : error ? (
                <div className="text-red-500 text-center py-8">
                    Error: {error}
                </div>
            ) : (
                <AnimatePresence>
                    {posts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onReaction={handleReaction}
                            onMarkAsResolved={handleMarkAsResolved}
                            onViewPost={handleViewPost}
                        />
                    ))}
                </AnimatePresence>
            )}
            {!loading && posts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    まだ投稿がありません。最初の悩みを投稿してみましょう。
                </div>
            )}
        </div>
    );
};

export default ZenGoApp;