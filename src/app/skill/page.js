  "use client"
  import React, { useState, useEffect } from 'react';
  import { GoogleGenerativeAI } from '@google/generative-ai';

  const AIP_KEY = "スマホのキー";

  const genAI = new GoogleGenerativeAI(AIP_KEY);

  // アイコン (Lucide React) - MVPに必要なものだけ残す
  const SearchIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="@11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );

  const UserIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  const XIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  const BriefcaseIcon = ({ className = "w-4 h-4" }) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
  );

  const MailIcon = ({ className = "w-4 h-4" }) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
      </svg>
  );

  const ActivityIcon = ({ className = "w-4 h-4" }) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
      </svg>
  );


  // モックデータ (実際のAPIやDBの代わり)
  const mockUsers2 = [
    { id: 1, name: '山田 太郎', department: '技術開発部', skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'UIデザイン'], email: 'taro.yamada@example.com', recentActivity: 'プロジェクトAlphaのフロントエンド設計・開発を担当。新技術TypeScriptの導入を推進。' },
    { id: 2, name: '佐藤 花子', department: '営業企画部', skills: ['Python', 'データ分析', '市場調査', 'Excel', 'Tableau'], email: 'hanako.sato@example.com', recentActivity: '新製品Xの市場分析レポートを作成し、経営会議で発表。データに基づいた戦略を提案。' },
    { id: 3, name: '鈴木 一郎', department: '人事部', skills: ['採用戦略', '労務管理', '研修企画', 'リーダーシップ開発'], email: 'ichiro.suzuki@example.com', recentActivity: '2025年度新卒採用計画を立案。オンライン会社説明会を企画・実施。' },
    { id: 4, name: '田中 真理子', department: '技術開発部', skills: ['Python', '機械学習', 'Vertex AI', 'GCP', '自然言語処理'], email: 'mariko.tanaka@example.com', recentActivity: '顧客問い合わせ対応効率化のためのAIチャットボットのPoC（概念実証）を主導。' },
    { id: 5, name: '渡辺 健太', department: 'マーケティング部', skills: ['SEO', 'コンテンツマーケティング', 'SNS運用', 'React', 'Google Analytics'], email: 'kenta.watanabe@example.com', recentActivity: '新サービスSkillNaviのプロモーション戦略を立案。ターゲット層へのリーチ拡大施策を実行中。' },
    { id: 6, name: '高橋 さゆり', department: 'デザイン部', skills: ['UIデザイン', 'UXリサーチ', 'Figma', 'Adobe Creative Suite', 'ユーザビリティテスト'], email: 'sayuri.takahashi@example.com', recentActivity: '全社ポータルサイトのUI/UX改善プロジェクトに参画。ユーザーインタビューを実施。'},
  ];

  const mockUsers = [
      // 既存のモックデータ (id: 1-6)
      { id: 1, name: '山田 太郎', department: '技術開発部', skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'UIデザイン'], email: 'taro.yamada@example.com', recentActivity: 'プロジェクトAlphaのフロントエンド設計・開発を担当。新技術TypeScriptの導入を推進。' },
      { id: 2, name: '佐藤 花子', department: '営業企画部', skills: ['Python', 'データ分析', '市場調査', 'Excel', 'Tableau'], email: 'hanako.sato@example.com', recentActivity: '新製品Xの市場分析レポートを作成し、経営会議で発表。データに基づいた戦略を提案。' },
      { id: 3, name: '鈴木 一郎', department: '人事部', skills: ['採用戦略', '労務管理', '研修企画', 'リーダーシップ開発'], email: 'ichiro.suzuki@example.com', recentActivity: '2025年度新卒採用計画を立案。オンライン会社説明会を企画・実施。' },
      { id: 4, name: '田中 真理子', department: '技術開発部', skills: ['Python', '機械学習', 'Vertex AI', 'GCP', '自然言語処理'], email: 'mariko.tanaka@example.com', recentActivity: '顧客問い合わせ対応効率化のためのAIチャットボットのPoC（概念実証）を主導。' },
      { id: 5, name: '渡辺 健太', department: 'マーケティング部', skills: ['SEO', 'コンテンツマーケティング', 'SNS運用', 'React', 'Google Analytics'], email: 'kenta.watanabe@example.com', recentActivity: '新サービスSkillNaviのプロモーション戦略を立案。ターゲット層へのリーチ拡大施策を実行中。' },
      { id: 6, name: '高橋 さゆり', department: 'デザイン部', skills: ['UIデザイン', 'UXリサーチ', 'Figma', 'Adobe Creative Suite', 'ユーザビリティテスト'], email: 'sayuri.takahashi@example.com', recentActivity: '全社ポータルサイトのUI/UX改善プロジェクトに参画。ユーザーインタビューを実施。'},
      // ここから新規生成データ (id: 7-106)
      { id: 7, name: '伊藤 大輔', department: 'ネットワーク運用部', skills: ['Cisco IOS', 'Juniper Junos', 'BGP', 'OSPF', 'Firewall'], email: 'daisuke.ito@example.com', recentActivity: 'コアネットワークの増強作業を計画・実行。トラフィック監視と障害対応を担当。' },
      { id: 8, name: '山本 美咲', department: 'カスタマーサポート部', skills: ['電話応対', 'メール対応', 'クレーム処理', 'Zendesk', 'テクニカルサポート'], email: 'misaki.yamamoto@example.com', recentActivity: '新サービスの問い合わせ対応マニュアルを作成。オペレーターの研修を実施。' },
      { id: 9, name: '中村 学', department: 'サーバー技術部', skills: ['Linux', 'Apache', 'MySQL', 'AWS EC2', 'Shell Script'], email: 'manabu.nakamura@example.com', recentActivity: 'Webサーバー群のパフォーマンスチューニングを実施。セキュリティパッチの適用を管理。' },
      { id: 10, name: '小林 陽子', department: '法人営業部', skills: ['提案書作成', 'プレゼンテーション', 'Salesforce', 'ソリューション営業', '通信サービス知識'], email: 'yoko.kobayashi@example.com', recentActivity: '大手クライアント向けに新しいクラウド接続ソリューションを提案し、受注獲得。' },
      { id: 11, name: '加藤 拓也', department: 'サービス企画部', skills: ['新規事業企画', '市場調査', '競合分析', 'プロジェクト管理', 'ワイヤーフレーム作成'], email: 'takuya.kato@example.com', recentActivity: '次世代型オンラインストレージサービスの企画立案と事業計画策定に従事。' },
      { id: 12, name: '吉田 直子', department: '人事部', skills: ['中途採用', '面接官トレーニング', '人事制度設計', '労務関連法規'], email: 'naoko.yoshida@example.com', recentActivity: 'エンジニア採用強化のためのダイレクトリクルーティング戦略を推進。' },
      { id: 13, name: '佐々木 健一', department: '情報システム部', skills: ['社内ネットワーク管理', 'Active Directory', 'Microsoft 365運用', 'IT資産管理', 'セキュリティポリシー策定'], email: 'kenichi.sasaki@example.com', recentActivity: '全社的なクライアントPCのリプレイスプロジェクトを主導。ヘルプデスク業務の効率化を推進。' },
      { id: 14, name: '山口 愛', department: 'マーケティング部', skills: ['Web広告運用', 'Google Ads', 'Facebook広告', 'データ分析', 'キャンペーン企画'], email: 'ai.yamaguchi@example.com', recentActivity: '個人向け新プランのデジタルマーケティング戦略を立案し、広告キャンペーンを展開中。' },
      { id: 15, name: '松本 浩', department: '技術開発部', skills: ['Java', 'Spring Boot', 'Microservices', 'Docker', 'Kubernetes'], email: 'hiroshi.matsumoto@example.com', recentActivity: 'B2B向け認証基盤システムのリニューアルプロジェクトでバックエンド開発を担当。' },
      { id: 16, name: '井上 恵子', department: 'デザイン部', skills: ['Webデザイン', 'LP制作', 'Illustrator', 'Photoshop', 'HTML/CSSコーディング'], email: 'keiko.inoue@example.com', recentActivity: '新サービスのプロモーションサイトのデザイン及びコーディングを担当。' },
      { id: 17, name: '木村 雄太', department: 'ネットワーク技術部', skills: ['SDN', 'NFV', 'Python自動化', 'トラフィック分析', 'IPv6移行'], email: 'yuta.kimura@example.com', recentActivity: 'ネットワーク運用の自動化推進プロジェクトに参加。トラフィック異常検知システムの開発。' },
      { id: 18, name: '林 裕子', department: '営業企画部', skills: ['営業戦略立案', 'KPI管理', 'SFA導入支援', '市場トレンド分析', 'ExcelVBA'], email: 'yuko.hayashi@example.com', recentActivity: '営業部門の目標達成に向けた販売促進策の企画と効果測定を実施。' },
      { id: 19, name: '斎藤 直樹', department: '品質管理部', skills: ['テスト計画', 'テスト設計', 'JSTQB', 'バグトラッキングシステム(Jira)', 'リリース管理'], email: 'naoki.saito@example.com', recentActivity: '新機能リリース前の受け入れテストプロセスを統括。品質基準の策定。' },
      { id: 20, name: '清水 明日香', department: 'カスタマーサポート部', skills: ['エスカレーション対応', 'VOC分析', 'FAQ作成', 'コミュニティ運営支援', 'CRM活用'], email: 'asuka.shimizu@example.com', recentActivity: '顧客からの重要インシデント対応と、そのフィードバックを元にしたサービス改善提案。' },
      { id: 21, name: '岡田 誠', department: 'セキュリティオペレーションセンター(SOC)', skills: ['SIEM運用', 'インシデントレスポンス', '脅威ハンティング', 'マルウェア解析', 'フォレンジック調査'], email: 'makoto.okada@example.com', recentActivity: 'サイバー攻撃の監視と分析、インシデント発生時の初動対応と報告業務。' },
      { id: 22, name: '長谷川 京子', department: '経営企画部', skills: ['事業計画策定', 'M&A検討', 'IR資料作成', '財務分析', '業界リサーチ'], email: 'kyoko.hasegawa@example.com', recentActivity: '中期経営計画のローリング及び、新規事業領域の市場調査と事業性評価。' },
      { id: 23, name: '森 竜也', department: 'クラウドソリューション部', skills: ['AWS', 'Azure', 'GCP', 'コンテナ技術(ECS, AKS, GKE)', 'サーバーレスアーキテクチャ'], email: 'tatsuya.mori@example.com', recentActivity: '顧客向けマルチクラウド環境の設計・構築コンサルティング。PaaS導入支援。' },
      { id: 24, name: '阿部 恵美', department: '広報部', skills: ['プレスリリース作成', 'メディアリレーション', 'SNS公式アカウント運用', 'イベント企画', '危機管理広報'], email: 'emi.abe@example.com', recentActivity: '企業の技術ブランディング向上のためのPR戦略を企画。技術系イベントへの出展準備。' },
      { id: 25, name: '石川 聡', department: 'データサイエンス部', skills: ['機械学習モデル構築', 'Python(Pandas, Scikit-learn)', 'R', 'SQL', 'データ可視化(Tableau, PowerBI)'], email: 'satoshi.ishikawa@example.com', recentActivity: '解約予測モデルの精度改善プロジェクトをリード。マーケティング施策へのデータ活用提案。' },
      { id: 26, name: '遠藤 久美子', department: '法務部', skills: ['契約書審査', '知的財産管理', '個人情報保護法対応', 'コンプライアンス体制構築', '紛争対応'], email: 'kumiko.endo@example.com', recentActivity: '新規サービス利用規約の作成及びレビュー。社内コンプライアンス研修の講師。' },
      { id: 27, name: '藤田 和也', department: 'アクセス網設計部', skills: ['FTTH設計', 'PON技術', '光伝送装置', 'AutoCAD', '地理情報システム(GIS)'], email: 'kazuya.fujita@example.com', recentActivity: '新規エリアへの光アクセス網の敷設設計及び設備管理。' },
      { id: 28, name: '後藤 優香', department: 'パートナーアライアンス部', skills: ['協業戦略', 'アライアンス交渉', 'パートナープログラム運営', 'プロダクト連携', 'ビジネスデベロップメント'], email: 'yuka.goto@example.com', recentActivity: '大手SaaSベンダーとの協業による新ソリューションの共同開発プロジェクトを推進。' },
      { id: 29, name: '村上 亮', department: '技術開発部', skills: ['Go言語', 'gRPC', 'Prometheus', 'Grafana', 'CI/CD(GitLab CI)'], email: 'ryo.murakami@example.com', recentActivity: '大規模分散システムのモニタリング基盤の開発・運用を担当。' },
      { id: 30, name: '橋本 彩乃', department: '人事部', skills: ['研修企画・運営', 'eラーニングシステム管理', 'キャリア開発支援', '評価制度運用'], email: 'ayano.hashimoto@example.com', recentActivity: '全社的なDX人材育成プログラムの企画と研修コンテンツ開発を主導。' },
      // ... (id: 31 から 100 までは同様のパターンで部署、スキル、活動内容を変化させて生成) ...
      { id: 101, name: '中島 裕樹', department: 'ネットワーク運用部', skills: ['MPLS', 'セグメントルーティング', 'ネットワーク仮想化', 'トラフィックエンジニアリング', '障害切り分け'], email: 'hiroki.nakajima@example.com', recentActivity: 'バックボーンネットワークの安定運用とキャパシティプランニングを担当。次期ルータ導入検証。' },
      { id: 102, name: '西村 亜美', department: 'カスタマーサポート部', skills: ['チャットサポート', 'リモートサポートツール', 'ナレッジベース構築', '顧客満足度調査', '多言語対応(英語)'], email: 'ami.nishimura@example.com', recentActivity: 'チャットサポート導入による応答率向上プロジェクトに参画。英語対応可能なオペレーター育成。' },
      { id: 103, name: '前田 浩一', department: 'サーバー技術部', skills: ['PostgreSQL', 'Redis', '負荷分散装置(BIG-IP)', 'OpenStack', 'サーバー監視'], email: 'koichi.maeda@example.com', recentActivity: 'データベースサーバーのパフォーマンス改善と冗長化構成の見直しを実施。' },
      { id: 104, name: '石井 奈々', department: '法人営業部', skills: ['アカウントマネジメント', 'クラウドPBX提案', 'SD-WANソリューション', 'パートナー協業', '業界特化ソリューション'], email: 'nana.ishii@example.com', recentActivity: '特定業界(例:医療)向けにカスタマイズしたネットワークソリューションの提案活動を展開。' },
      { id: 105, name: '小川 剛', department: 'サービス企画部', skills: ['IoTプラットフォーム企画', 'APIエコノミー戦略', 'リーンスタートアップ手法', 'UXリサーチ', 'プライシング戦略'], email: 'tsuyoshi.ogawa@example.com', recentActivity: '新たなIoT向け通信サービスの事業化に向けた市場調査とPoCを推進中。' },
      { id: 106, name: '野口 真希', department: '情報システム部', skills: ['ゼロトラストセキュリティ導入', 'IDaaS連携', 'EDR運用', 'ITガバナンス', 'BCP計画策定'], email: 'maki.noguchi@example.com', recentActivity: '全社的なゼロトラストネットワークアクセスの導入プロジェクトを推進。' }
    ];

  // ユーザーカードコンポーネント
  const UserCard = ({ user, onSelectUser }) => (
    <div 
      className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-transparent hover:border-sky-500"
      onClick={() => onSelectUser(user)}
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="bg-sky-500 text-white rounded-full p-3 flex items-center justify-center w-12 h-12">
          <UserIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
          <p className="text-sm text-gray-500 flex items-center">
              <BriefcaseIcon className="w-4 h-4 mr-1 text-gray-400"/>
              {user.department}
          </p>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-600 mb-1">主要スキル:</h4>
        <div className="flex flex-wrap gap-2">
          {user.skills.slice(0, 3).map(skill => ( // 主要スキルを3つまで表示
            <span key={skill} className="bg-sky-100 text-sky-700 px-2.5 py-1 rounded-full text-xs font-medium">
              {skill}
            </span>
          ))}
          {user.skills.length > 3 && (
            <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-medium">
              他{user.skills.length - 3}件
            </span>
          )}
        </div>
      </div>
      <button 
          onClick={(e) => { e.stopPropagation(); onSelectUser(user); }}
          className="mt-4 w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors duration-200"
      >
          詳細を見る
      </button>
    </div>
  );

  // ユーザープロフィールモーダル
  const UserProfileModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 md:p-8 relative animate-fadeInUp">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="閉じる"
          >
            <XIcon className="w-7 h-7" />
          </button>
          
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
            <div className="bg-gradient-to-br from-sky-500 to-indigo-600 text-white rounded-full p-4 flex items-center justify-center w-20 h-20 shadow-lg">
              <UserIcon className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-600 flex items-center mt-1">
                  <BriefcaseIcon className="w-5 h-5 mr-2 text-sky-500"/>
                  {user.department}
              </p>
              <p className="text-gray-600 flex items-center mt-1">
                  <MailIcon className="w-5 h-5 mr-2 text-sky-500"/>
                  <a href={`mailto:${user.email}`} className="hover:underline text-sky-600">{user.email}</a>
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-1 border-gray-200">スキルセット</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map(skill => (
                  <span key={skill} className="bg-sky-100 text-sky-800 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-1 border-gray-200 flex items-center">
                  <ActivityIcon className="w-5 h-5 mr-2 text-sky-500"/>
                  最近の活動・担当業務
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-md">
                {user.recentActivity || '登録されている活動はありません。'}
              </p>
            </div>
          </div>

          <button 
              className="mt-8 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
              onClick={() => alert(`「${user.name}」さんに質問を送信する機能を実装します。`)} // MVPではalertで代替
          >
            この人に質問してみる！
          </button>
        </div>
      </div>
    );
  };

  // 検索ページコンポーネント
  const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [error, setError] = useState(null);


    // 検索処理 (MVPではモックデータフィルタリング)
    const handleSearch = () => {
      if (!searchTerm.trim()) {
          setSearchResults([]);
          setHasSearched(true);
          return;
      }
      setIsLoading(true);
      setHasSearched(true);

      // Simulate API call delay
      setTimeout(() => {
          const lowerSearchTerm = searchTerm.toLowerCase();
          const results = mockUsers.filter(user => 
            user.name.toLowerCase().includes(lowerSearchTerm) ||
            user.department.toLowerCase().includes(lowerSearchTerm) ||
            user.skills.some(skill => skill.toLowerCase().includes(lowerSearchTerm))
          );
          setSearchResults(results);
          setIsLoading(false);
      }, 500);
    };
    
    useEffect( async()=>{
      setError(null);
      setResponse('');

      if(!prompt){
        setError('プロンプトが空です');
        return;
      }

      try{
        const model = genAI.getGenerativeModel({model: 'gemini-pro'});
        const result = await model.generateContent(prompt);
        const apiResponse = result.response;
        const text = apiResponse.text();

        setResponse(text);
      }catch(e){
        console.log(e);
        setError(`failed to get ressponse from Gimini API: ${e.message}`);
      }finally{
        setIsLoading(false);
      }
    },[]);


    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">スキル探索</h1>
          <p className="text-gray-600 text-center mb-6">スキル、氏名、部署名などで社内の専門家を探せます。</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="例: Python, 山田太郎, AI, マーケティング"
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-shadow text-lg"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 flex items-center justify-center text-lg disabled:opacity-50"
            >
              <SearchIcon className="w-5 h-5 mr-2" />
              {isLoading ? '検索中...' : '検索'}
            </button>
          </div>
        </div>

        {/* <OutputAIdocumnet /> */}

        {isLoading && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
            <p className="mt-3 text-gray-600">検索しています...</p>
          </div>
        )}

        {!isLoading && hasSearched && searchResults.length === 0 && (
          <div className="text-center py-10 bg-white shadow-lg rounded-xl p-8">
            <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">検索結果が見つかりません</h3>
            <p className="text-gray-500 mt-2">検索キーワードを変更して再度お試しください。</p>
          </div>
        )}
        
        {!isLoading && searchResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map(user => (
              <UserCard key={user.id} user={user} onSelectUser={setSelectedUser} />
            ))}
          </div>
        )}

        {!isLoading && !hasSearched && (
          <div className="text-center py-10 bg-white shadow-lg rounded-xl p-8">
            <SearchIcon className="w-16 h-16 text-sky-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">スキルや名前で検索を開始しましょう</h3>
            <p className="text-gray-500 mt-2">「誰に聞けばいいか分からない」を解決します。</p>
          </div>
        )}


        <UserProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      </div>
    );
  };


  // メインアプリケーションコンポーネント
  function Page() {
    useEffect(() => {
      document.title = 'スキルナビ MVP';
    }, []);

    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100 font-sans text-gray-900">
        {/* ヘッダー */}
        <header className="bg-white shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex-shrink-0">
                <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center space-x-2 text-2xl font-bold text-sky-600 hover:text-sky-700 transition-colors">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM13 7H11V11H7V13H11V17H13V13H17V11H13V7Z"/></svg>
                  <span>スキルナビ <span className="text-sm font-normal text-indigo-500">(MVP)</span></span>
                </a>
              </div>
              {/* MVPではナビゲーションは簡略化 */}
              <div>
                  <span className="text-sm text-gray-500">社内知見検索システム</span>
              </div>
            </div>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <SearchPage />
        </main>

        {/* フッター */}
        <footer className="bg-gray-800 text-white mt-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            <p className="text-sm">&copy; 2025 スキルナビ (仮称) MVP. All rights reserved.</p>
          </div>
        </footer>
        
        {/* CSS for Modal Animation - Tailwind doesn't have this out of the box */}
        <style jsx global>{`
          .animate-fadeInUp {
            animation: fadeInUp 0.3s ease-out forwards;
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }

  export default Page;
