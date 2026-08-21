// LexiQuest Canon Game Data: Regions, Shards & Tree Restoration System
const LEXIQUEST_DATA = {
    treeName: 'LEXARIS - Cội Nguồn Khai Minh',
    totalShards: 8,
    
    // Regions of Lexia
    regions: [
        { id: 'grove', name: 'Khu Vườn Cội Nguồn Lexaris (Central Hub)', color: '#00fff5' },
        { id: 'english_foundations', name: 'Tàn Tích Nền Móng (Shattered Foundations)', color: '#0984e3' },
        { id: 'english_citadel', name: 'Thành Trì Cấu Trúc (Citadel of Form)', color: '#6c5ce7' },
        { id: 'su_viet', name: 'Cõi Ký Ức Non Sông (Đại Sử Việt)', color: '#e17055' }
    ],

    // Knowledge Shards scattered across the world map
    shards: [
        {
            id: 1,
            title: 'Mảnh Rune S-V-O (Cấu Trúc Câu)',
            region: 'english_foundations',
            x: 5, y: 3,
            icon: '💎',
            color: '#00fff5',
            collected: false,
            dialogue: [
                { speaker: 'Lex', avatar: 'lex', text: 'Kaelen! Cậu đã tìm thấy Mảnh Rune S-V-O bị Nhàn Nhã Hội chôn vùi!' },
                { speaker: 'Kaelen', avatar: 'kaelen', text: 'Mảnh tri thức này sẽ nối lại các từ ngữ bị gãy rập trong thế giới.' }
            ],
            puzzle: {
                prompt: 'Ghép mảnh Rune đúng cấu trúc Subject + Verb + Object (S-V-O):',
                options: [
                    'Kaelen gathers the Knowledge Shard.',
                    'Gathers Kaelen the Knowledge Shard.',
                    'The Knowledge Shard Kaelen gathers.'
                ],
                correct: 0,
                explanation: 'Chính xác! "Kaelen" (S) + "gathers" (V) + "the Knowledge Shard" (O). Mảnh Tri Thức đầu tiên đã được khôi phục!'
            }
        },
        {
            id: 2,
            title: 'Mảnh Rune Identity (Đại Từ & Tên Gọi)',
            region: 'english_foundations',
            x: 19, y: 3,
            icon: '✨',
            color: '#00cec9',
            collected: false,
            dialogue: [
                { speaker: 'Lex', avatar: 'lex', text: 'Đây là Mảnh Rune Identity! Nó trao lại danh tánh cho những thực thể bị lãng quên.' }
            ],
            puzzle: {
                prompt: 'Chọn đại từ phù hợp: "Lex and Kaelen restored the Tree by _____."',
                options: [
                    'themselves',
                    'himself',
                    'itself'
                ],
                correct: 0,
                explanation: 'Đúng! "themselves" phản chiếu nhóm nhân vật (Lex and Kaelen).'
            }
        },
        {
            id: 3,
            title: 'Mảnh Ký Ức 938: Chiến Thắng Bạch Đằng Giang',
            region: 'su_viet',
            x: 3, y: 10,
            icon: '🗡️',
            color: '#ff7675',
            collected: false,
            dialogue: [
                { speaker: 'Sử', avatar: 'su', text: 'Kaelen! Mảnh ký ức này ghi lại trí tuệ thủy triều của Đức Ngô Quyền năm 938!' },
                { speaker: 'Oblivitas', avatar: 'oblivitas', text: 'Đừng chạm vào nó! Hãy để nó chỉ là một con số 938 khô khốc!' },
                { speaker: 'Kaelen', avatar: 'kaelen', text: 'Không! Trí tuệ của tiền nhân phải được chiếu sáng!' }
            ],
            puzzle: {
                prompt: 'Chiến thuật cốt lõi giúp Ngô Quyền đánh tan quân Nam Hán năm 938 là gì?',
                options: [
                    'Cắm cọc gỗ đầu bọc sắt xuống lòng sông, dụ địch vào khi thủy triều rút.',
                    'Dùng đại bác tầm xa bắn chìm hạm đội địch.',
                    'Xây thành lũy đất cao bao quanh cửa sông.'
                ],
                correct: 0,
                explanation: 'Tuyệt vời! Ngô Quyền tận dụng quy luật tự nhiên và địa hình sông nước - đó là trí tuệ Việt Nam!'
            }
        },
        {
            id: 4,
            title: 'Mảnh Ký Ức Hào Khí Đông A (Hội Nghị Diên Hồng)',
            region: 'su_viet',
            x: 21, y: 10,
            icon: '🔥',
            color: '#fab1a0',
            collected: false,
            dialogue: [
                { speaker: 'Sử', avatar: 'su', text: 'Mảnh ký ức Diên Hồng! Nơi ngọn lửa đoàn kết toàn dân nhà Trần bùng cháy!' }
            ],
            puzzle: {
                prompt: 'Khi Vua Trần hỏi ý kiến các phụ lão tại điện Diên Hồng: "Nên Đánh hay Hòa?", muôn người đã hô vang điều gì?',
                options: [
                    'ĐÁNH!',
                    'HÒA!',
                    'RÚT LƯỢNG!'
                ],
                correct: 0,
                explanation: 'Chính xác! Tiếng hô "ĐÁNH!" vang dội thể hiện ý chí quật cường của cả dân tộc!'
            }
        },
        {
            id: 5,
            title: 'Mảnh Rune Phân Loại Danh Từ (Nouns Archive)',
            region: 'english_citadel',
            x: 8, y: 8,
            icon: '📘',
            color: '#74b9ff',
            collected: false,
            dialogue: [
                { speaker: 'Lex', avatar: 'lex', text: 'Mảnh Rune Nouns bị niêm phong trong Thư Khố Cổ Đại!' }
            ],
            puzzle: {
                prompt: 'Từ nào dưới đây là Danh Từ Không Đếm Được (Uncountable Noun)?',
                options: [
                    'Knowledge (Tri thức)',
                    'Book (Sách)',
                    'Shard (Mảnh)'
                ],
                correct: 0,
                explanation: 'Đúng! "Knowledge" là danh từ không đếm được. Tri thức là dòng chảy vô tận!'
            }
        },
        {
            id: 6,
            title: 'Mảnh Ký Ức Lam Sơn: Bình Ngô Đại Cáo',
            region: 'su_viet',
            x: 12, y: 11,
            icon: '📜',
            color: '#fdcb6e',
            collected: false,
            dialogue: [
                { speaker: 'Sử', avatar: 'su', text: 'Đây là Mảnh Ký Ức về Bình Ngô Đại Cáo của Nguyễn Trãi - thiên cổ hùng văn tuyên ngôn độc lập!' }
            ],
            puzzle: {
                prompt: 'Tư tưởng nhân nghĩa xuyên suốt trong Bình Ngô Đại Cáo của Nguyễn Trãi là gì?',
                options: [
                    'Việc nhân nghĩa cốt ở yên dân / Quân điên phạt trước lo trừ bạo.',
                    'Dùng sức mạnh trừng phạt mọi quốc gia láng giềng.',
                    'Tích trữ thật nhiều của cải vàng bạc.'
                ],
                correct: 0,
                explanation: 'Chính xác! Nhân nghĩa là vì nhân dân, trừ bạo mang lại hòa bình!'
            }
        },
        {
            id: 7,
            title: 'Mảnh Rune Tường Thuật (Reported Speech)',
            region: 'english_citadel',
            x: 16, y: 8,
            icon: '🗣️',
            color: '#a29bfe',
            collected: false,
            dialogue: [
                { speaker: 'Lex', avatar: 'lex', text: 'Mảnh Rune Tường Thuật giúp truyền đạt tư tưởng mà không làm biến dạng thông điệp.' }
            ],
            puzzle: {
                prompt: 'Chuyển sang câu tường thuật: Kaelen said: "I search for the truth."',
                options: [
                    'Kaelen said that he searched for the truth.',
                    'Kaelen said that I search for the truth.',
                    'Kaelen says that he will search for truth.'
                ],
                correct: 0,
                explanation: 'Đúng! Khi tường thuật ở quá khứ, động từ lùi thì: "search" -> "searched".'
            }
        },
        {
            id: 8,
            title: 'Mảnh Ký Ức Tuyên Ngôn Độc Lập 2/9/1945',
            region: 'grove',
            x: 12, y: 3,
            icon: '⭐',
            color: '#ffeaa7',
            collected: false,
            dialogue: [
                { speaker: 'Sử', avatar: 'su', text: 'Mảnh Ký Ức cuối cùng tại Cột Cờ Hà Nội ngày 2/9/1945! Bản Tuyên Ngôn Độc Lập khai sinh ra nước Việt Nam Dân chủ Cộng hòa!' },
                { speaker: 'Kaelen', avatar: 'kaelen', text: 'Mảnh ghép này sẽ giúp Cội Nguồn Lexaris bừng sáng hoàn toàn!' }
            ],
            puzzle: {
                prompt: 'Chủ tịch Hồ Chí Minh đã đọc Tuyên ngôn Độc lập tại đâu vào ngày 2/9/1945?',
                options: [
                    'Quảng trường Ba Đình, Hà Nội.',
                    'Bến Nhà Rồng, Sài Gòn.',
                    'Cố đô Huế.'
                ],
                correct: 0,
                explanation: 'Hoàn hảo! Quảng trường Ba Đình lịch sử năm 1945 - nơi khẳng định quyền tự do độc lập!'
            }
        }
    ]
};
