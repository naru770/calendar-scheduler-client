## 概要
PCだけでなくスマホでもカレンダー表示ができるスケジュール共有アプリ

<img src="https://user-images.githubusercontent.com/95570185/208721140-6d5dbab1-b383-4136-8031-8c2a587500dc.png">
<img src="https://user-images.githubusercontent.com/95570185/208720983-e86c96b3-4533-418c-95ef-067ac694a5ac.png" width="300px">



## 使い方

1. supabaseで以下のテーブルを作成する。

table name: event
| Name       | Data Type                | Format      |
|------------|--------------------------|-------------|
| user_id    | uuid                     | uuid        |
| created_at | timestamp with time zone | timestamptz |
| content    | text                     | text        |
| start_date | date                     | date        |
| start_time | time without time zone   | time        |
| is_timed   | boolean                  | bool        |
| id         | uuid                     | uuid        |

table name: user
| Name       | Data Type                | Format      |
|------------|--------------------------|-------------|
| created_at | timestamp with time zone | timestamptz |
| name       | text                     | text        |
| color      | text                     | text        |
| id         | uuid                     | uuid        |

1. ```calendar-scheduler-client/.env.local```を作成し、以下を記述。
```
REACT_APP_SUPABASE_URL={supabaseのProject URL}
REACT_APP_SUPABASE_KEY={supabaseのProject API keys}
```

1. 以下を実行。
```
npm install
npm start
```
