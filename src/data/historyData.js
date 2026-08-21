// LexiQuest History Campaign Data (MODULE 4: THE LAND OF HISTORY - Canon Concept Bible Spec)
export const HISTORY_CAMPAIGN = {
    id: 'campaign-history',
    title: 'MODULE 4: THE LAND OF HISTORY (Đại Sử Việt - Hồn Thiêng Non Sông)',
    colorTheme: '#d35400', // Đỏ cam
    icon: '🥁', // Trống đồng
    unlocked: false, // Locked until English Modules 1-3 completed!
    chapters: [
        {
            id: 'history-stage-1',
            title: 'Stage 1: The Ancient Gate (Cổng thành cổ - Bạch Đằng Giang 938)',
            tileX: 3, tileY: 9, icon: '🏛️',
            classification: 'Bạch Đằng Giang 938',
            sourceRefs: ['Bảo tàng Lịch sử Quốc gia - Ngô Quyền và Chiến thắng Bạch Đằng 938'],
            dialogue: [
                { speaker: 'Sử', avatar: 'su', text: 'Kaelen! Cùng tớ mở Cổng thành cổ Bạch Đằng Giang 938! Trí tuệ cọc gỗ bọc sắt đánh tan quân Nam Hán!' }
            ],
            puzzle: {
                prompt: 'Chiến thuật quyết định của Ngô Quyền trên sông Bạch Đằng năm 938 là gì?',
                options: [
                    'Cắm cọc gỗ đầu bọc sắt xuống lòng sông, dụ thuyền địch vào khi thủy triều rút.',
                    'Xây thành lũy đá kiên cố trên bờ.',
                    'Dùng hỏa công đốt thuyền địch trên bến.'
                ],
                correct: 0,
                explanation: 'Tuyệt vời! Ngô Quyền tận dụng quy luật tự nhiên và địa hình sông nước - trí tuệ quân sự Việt Nam! (Nguồn: Bảo tàng Lịch sử Quốc gia)'
            }
        },
        {
            id: 'history-stage-2',
            title: 'Stage 2: The Chronicle Village (Làng sử ký - Hào Khí Diên Hồng)',
            tileX: 17, tileY: 9, icon: '🔥',
            classification: 'Hội Nghị Diên Hồng',
            sourceRefs: ['Bảo tàng Lịch sử Quốc gia - Nhà Trần 3 lần kháng chiến Nguyên Mông'],
            dialogue: [
                { speaker: 'Sử', avatar: 'su', text: 'Mảnh Ký Ức Làng Sử Ký Diên Hồng! Tiếng hô "ĐÁNH!" vang dội của các vị phụ lão nhà Trần!' }
            ],
            puzzle: {
                prompt: 'Khi Vua Trần hỏi ý kiến các phụ lão tại điện Diên Hồng: "Nên Đánh hay Hòa?", muôn người đã hô vang điều gì?',
                options: ['ĐÁNH!', 'HÒA!', 'RÚT!'],
                correct: 0,
                explanation: 'Chính xác! Tiếng hô "ĐÁNH!" thể hiện ý chí quật cường của toàn dân tộc! (Nguồn: Bảo tàng Lịch sử Quốc gia)'
            }
        },
        {
            id: 'history-stage-3',
            title: 'Stage 3: The Legendary Battlefield (Chiến trường huyền thoại - Lam Sơn)',
            tileX: 12, tileY: 10, icon: '📜',
            classification: 'Bình Ngô Đại Cáo',
            sourceRefs: ['Bảo tàng Lịch sử Quốc gia - Nguyễn Trãi trong khởi nghĩa Lam Sơn'],
            dialogue: [
                { speaker: 'Sử', avatar: 'su', text: 'Stage 3 - Chiến trường huyền thoại! Bình Ngô Đại Cáo của Nguyễn Trãi!' }
            ],
            puzzle: {
                prompt: 'Tư tưởng cốt lõi trong Bình Ngô Đại Cáo là gì?',
                options: [
                    'Việc nhân nghĩa cốt ở yên dân / Quân điên phạt trước lo trừ bạo.',
                    'Tích trữ tài sản vàng bạc.',
                    'Mở rộng lãnh thổ sang các nước khác.'
                ],
                correct: 0,
                explanation: 'Chính xác! Tư tưởng nhân nghĩa vì yên dân và hòa bình! (Nguồn: Bảo tàng Lịch sử Quốc gia)'
            }
        },
        {
            id: 'history-stage-4',
            title: 'Stage 4 (Boss): The Shadow of War (Trận chiến Bóng Tối Chiến Tranh)',
            tileX: 10, tileY: 3, icon: '⭐',
            classification: 'Ba Đình 2/9/1945',
            sourceRefs: ['Bảo tàng Hồ Chí Minh - Tuyên ngôn Độc lập 2/9/1945'],
            dialogue: [
                { speaker: 'Sử', avatar: 'su', text: 'Trận chiến cuối cùng - Đánh tan Bóng Tối Chiến Tranh tại Quảng trường Ba Đình lịch sử!' }
            ],
            puzzle: {
                prompt: 'Chủ tịch Hồ Chí Minh đã đọc Tuyên ngôn Độc lập tại đâu ngày 2/9/1945?',
                options: ['Quảng trường Ba Đình, Hà Nội.', 'Bến Nhà Rồng, Sài Gòn.', 'Cố đô Huế.'],
                correct: 0,
                explanation: 'Hoàn hảo! Quảng trường Ba Đình lịch sử! (Nguồn: Bảo tàng Hồ Chí Minh)'
            }
        }
    ]
};
