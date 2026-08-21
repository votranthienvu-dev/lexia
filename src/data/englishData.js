// LexiQuest English Campaign Data (Canon Concept Bible - 4 Modules Architecture)
export const ENGLISH_CAMPAIGN = {
    id: 'campaign-english',
    title: 'Chiến Dịch 1: Cổ Tự Rune Tiếng Anh (Modules 1-3)',
    unlocked: true,
    modules: [
        // MODULE 1: THE LAND OF WORDS
        {
            id: 'module-1',
            title: 'MODULE 1: THE LAND OF WORDS (Vùng Đất Từ Vựng)',
            colorTheme: '#27ae60', // Xanh lá
            icon: '📖',
            boss: {
                id: 'boss-module-1',
                name: 'The Word Golem (Golem Từ Vựng)',
                avatar: 'oblivitas',
                hp: 400,
                def: 60,
                title: 'Trận Chiến Golem Từ Vựng',
                questions: [
                    {
                        prompt: '[Trùm Module 1 - Pha 1] Chọn cấu trúc câu S-V-O hoàn chỉnh:',
                        options: ['Kaelen restores Lexaris.', 'Restores Kaelen Lexaris.', 'Lexaris Kaelen restores.'],
                        correct: 0,
                        explanation: 'Chính xác! S (Kaelen) + V (restores) + O (Lexaris).'
                    },
                    {
                        prompt: '[Trùm Module 1 - Pha 2] Từ nào là Noun Uncountable?',
                        options: ['Knowledge', 'Shard', 'Book'],
                        correct: 0,
                        explanation: 'Chính xác! Knowledge là danh từ không đếm được.'
                    },
                    {
                        prompt: '[Trùm Module 1 - Pha 3] Chọn dạng từ số nhiều đúng của "Child":',
                        options: ['Children', 'Childs', 'Childes'],
                        correct: 0,
                        explanation: 'Chính xác! Children là danh từ số nhiều bất quy tắc.'
                    }
                ]
            },
            stages: [
                {
                    id: 'stage-1',
                    title: 'Stage 1: The Forgotten Library (Thư viện bị lãng quên)',
                    mapZoneId: 'zone-stage-1',
                    wordChallenges: [
                        {
                            id: 'word-mod1-stg1-day1',
                            fileRef: 'Ngay 1.docx',
                            title: 'Thử Thách Ngày 1: Cấu Trúc S-V-O',
                            tileX: 5, tileY: 3, icon: '📖',
                            dialogue: [{ speaker: 'Lex 🦉', avatar: 'lex', text: 'Kaelen! Thư viện bị lãng quên lưu giữ Cổ Tự Ngày 1! Hãy khôi phục quy luật S-V-O!' }],
                            puzzle: {
                                prompt: 'Sắp xếp câu chuẩn cấu trúc S-V-O:',
                                options: ['The Seeker protects the realm.', 'Protects the Seeker the realm.', 'The realm protects The Seeker.'],
                                correct: 0,
                                explanation: 'Đúng! S (The Seeker) + V (protects) + O (the realm).'
                            }
                        },
                        {
                            id: 'word-mod1-stg1-day2',
                            fileRef: 'Ngay 2.docx',
                            title: 'Thử Thách Ngày 2: Subject Pronouns',
                            tileX: 14, tileY: 3, icon: '✨',
                            dialogue: [{ speaker: 'Lex 🦉', avatar: 'lex', text: 'Mảnh Ngày 2! Giúp các thực thể lấy lại danh tánh bằng Subject Pronouns!' }],
                            puzzle: {
                                prompt: 'Chọn Subject Pronoun đúng: "___ protects Lexia with magic."',
                                options: ['He', 'Him', 'His'],
                                correct: 0,
                                explanation: 'Đúng! "He" đóng vai trò Chủ Ngữ (Subject).'
                            }
                        },
                        {
                            id: 'word-mod1-stg1-day3',
                            fileRef: 'Ngay 3.docx',
                            title: 'Thử Thách Ngày 3: Object Pronouns',
                            tileX: 4, tileY: 9, icon: '📘',
                            dialogue: [{ speaker: 'Lex 🦉', avatar: 'lex', text: 'Mảnh Ngày 3! Hãy tìm Object Pronoun đứng sau Động từ!' }],
                            puzzle: {
                                prompt: 'Chọn Object Pronoun: "Lex guides ___ through the ruins."',
                                options: ['him', 'he', 'his'],
                                correct: 0,
                                explanation: 'Đúng! "him" đứng sau Động từ "guides" đóng vai trò Tân Ngữ.'
                            }
                        },
                        {
                            id: 'word-mod1-stg1-day4',
                            fileRef: 'Ngay 4.docx',
                            title: 'Thử Thách Ngày 4: Possessive Adjectives',
                            tileX: 15, tileY: 9, icon: '🗝️',
                            dialogue: [{ speaker: 'Lex 🦉', avatar: 'lex', text: 'Mảnh Ngày 4! Khôi phục quyền sở hữu tri thức!' }],
                            puzzle: {
                                prompt: 'Chọn Possessive Adjective: "Kaelen holds ___ glowing staff."',
                                options: ['his', 'him', 'he'],
                                correct: 0,
                                explanation: 'Đúng! "his" bổ nghĩa cho danh từ "glowing staff".'
                            }
                        }
                    ]
                },
                {
                    id: 'stage-2',
                    title: 'Stage 2: The Vocabulary Forest (Khu rừng từ vựng)',
                    mapZoneId: 'zone-stage-2',
                    wordChallenges: [
                        {
                            id: 'word-mod1-stg2-day5',
                            fileRef: 'Ngày 5.docx',
                            title: 'Thử Thách Ngày 5: Plural Nouns',
                            tileX: 6, tileY: 4, icon: '🌲',
                            dialogue: [{ speaker: 'Lex 🦉', avatar: 'lex', text: 'Stage 2 - Khu rừng từ vựng! Danh từ số nhiều đang tỏa sáng!' }],
                            puzzle: {
                                prompt: 'Dạng số nhiều đúng của "Child" là gì?',
                                options: ['Children', 'Childs', 'Childes'],
                                correct: 0,
                                explanation: 'Đúng! "Children" là dạng danh từ số nhiều bất quy tắc.'
                            }
                        },
                        {
                            id: 'word-mod1-stg2-day6',
                            fileRef: 'Ngày 6.docx',
                            title: 'Thử Thách Ngày 6: Uncountable Nouns',
                            tileX: 13, tileY: 8, icon: '🧪',
                            dialogue: [{ speaker: 'Lex 🦉', avatar: 'lex', text: 'Ngày 6! Phân biệt danh từ không đếm được giữa khu rừng!' }],
                            puzzle: {
                                prompt: 'Từ nào là danh từ không đếm được?',
                                options: ['Information', 'Fact', 'Detail'],
                                correct: 0,
                                explanation: 'Đúng! "Information" là danh từ không đếm được.'
                            }
                        }
                    ]
                },
                {
                    id: 'stage-3',
                    title: 'Stage 3: The Missing Letters Mine (Mỏ khai thác chữ cái)',
                    mapZoneId: 'zone-stage-3',
                    wordChallenges: [
                        {
                            id: 'word-mod1-stg3-day7',
                            fileRef: 'Ngày 7.docx',
                            title: 'Thử Thách Ngày 7: Missing Letters',
                            tileX: 5, tileY: 5, icon: '⛏️',
                            dialogue: [{ speaker: 'Lex 🦉', avatar: 'lex', text: 'Stage 3 - Mỏ khai thác chữ cái! Khai quật ký tự bị phong ấn!' }],
                            puzzle: {
                                prompt: 'Điền chữ cái còn thiếu: "Kn_wledge"',
                                options: ['o', 'e', 'i'],
                                correct: 0,
                                explanation: 'Đúng! "Knowledge" nghĩa là Tri Thức.'
                            }
                        }
                    ]
                }
            ]
        },
        // MODULE 2: THE LAND OF GRAMMAR
        {
            id: 'module-2',
            title: 'MODULE 2: THE LAND OF GRAMMAR (Vùng Đất Ngữ Pháp)',
            colorTheme: '#2980b9', // Xanh dương
            icon: '📜',
            boss: {
                id: 'boss-module-2',
                name: 'The Grammar Guardian (Người Gác Ngữ Pháp)',
                avatar: 'oblivitas',
                hp: 600, def: 80,
                title: 'Trận Chiến Người Gác Ngữ Pháp',
                questions: [
                    {
                        prompt: '[Trùm Module 2 - Pha 1] Chọn câu thì Hiện Tại Đơn đúng:',
                        options: ['He goes to school.', 'He go to school.', 'He going to school.'],
                        correct: 0,
                        explanation: 'Chính xác! He/She/It đi với Động từ thêm s/es.'
                    }
                ]
            },
            stages: [
                {
                    id: 'stage-1',
                    title: 'Stage 1: The Ruined Classroom (Lớp học đổ nát)',
                    mapZoneId: 'zone-stage-1',
                    wordChallenges: [
                        {
                            id: 'word-mod2-stg1-day20',
                            fileRef: 'Ngày 20.docx',
                            title: 'Thử Thách Ngày 20: Present Simple Tense',
                            tileX: 7, tileY: 4, icon: '🏫',
                            dialogue: [{ speaker: 'Lex 🦉', avatar: 'lex', text: 'Module 2 Stage 1 - Lớp học đổ nát! Khôi phục quy luật Hiện Tại Đơn!' }],
                            puzzle: {
                                prompt: 'Chọn dạng động từ đúng: "She ___ (read) books every day."',
                                options: ['reads', 'read', 'reading'],
                                correct: 0,
                                explanation: 'Đúng! Chủ ngữ "She" đi với Động từ "reads".'
                            }
                        }
                    ]
                },
                {
                    id: 'stage-2',
                    title: 'Stage 2: The Grammar Bridge (Cây cầu ngữ pháp)',
                    mapZoneId: 'zone-stage-2',
                    wordChallenges: [
                        {
                            id: 'word-mod2-stg2-day22',
                            fileRef: 'Ngày 22.docx',
                            title: 'Thử Thách Ngày 22: Past Simple Tense',
                            tileX: 8, tileY: 5, icon: '🌉',
                            dialogue: [{ speaker: 'Lex 🦉', avatar: 'lex', text: 'Stage 2 - Cây cầu ngữ pháp! Khôi phục liên kết quá khứ!' }],
                            puzzle: {
                                prompt: 'Dạng Quá Khứ của "Go" là gì?',
                                options: ['went', 'gone', 'goed'],
                                correct: 0,
                                explanation: 'Đúng! "Went" là Quá khứ đơn của "Go".'
                            }
                        }
                    ]
                }
            ]
        },
        // MODULE 3: THE LAND OF FLUENCY
        {
            id: 'module-3',
            title: 'MODULE 3: THE LAND OF FLUENCY (Vùng Đất Giao Tiếp)',
            colorTheme: '#8e44ad', // Tím
            icon: '💬',
            boss: {
                id: 'boss-module-3',
                name: 'The Echo of Doubt (Bóng Tối Nghi Ngờ)',
                avatar: 'oblivitas',
                hp: 800, def: 100,
                title: 'Trận Chiến Bóng Tối Nghi Ngờ',
                questions: [
                    {
                        prompt: '[Trùm Module 3 - Pha 1] Chọn câu phản hồi giao tiếp tự tin:',
                        options: ['I can achieve it!', 'I doubt it.', 'I give up.'],
                        correct: 0,
                        explanation: 'Chính xác! Sự tự tin là chìa khóa giao tiếp!'
                    }
                ]
            },
            stages: [
                {
                    id: 'stage-1',
                    title: 'Stage 1: The Whisper Town (Thị trấn thì thầm)',
                    mapZoneId: 'zone-stage-1',
                    wordChallenges: [
                        {
                            id: 'word-mod3-stg1-day30',
                            fileRef: 'Ngày 30.docx',
                            title: 'Thử Thách Ngày 30: Daily Communication',
                            tileX: 6, tileY: 5, icon: '🏘️',
                            dialogue: [{ speaker: 'Lex 🦉', avatar: 'lex', text: 'Module 3 Stage 1 - Thị trấn thì thầm! Luyện tập giao tiếp!' }],
                            puzzle: {
                                prompt: 'Lời chào trang trọng khi gặp đối tác:',
                                options: ['Good morning, how do you do?', 'Hey bro, what’s up?', 'Bye now.'],
                                correct: 0,
                                explanation: 'Đúng! Lời chào trang trọng và lịch sự.'
                            }
                        }
                    ]
                }
            ]
        }
    ]
};
