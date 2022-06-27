# 使い方

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

2. ```calendar-scheduler-client/src/.env.local```を作成し、以下を記述。
```
REACT_APP_SUPABASE_URL={supabaseのProject URL}
REACT_APP_SUPABASE_KEY={supabaseのProject API keys}
```

3. 以下を実行。
```
npm install
npm start
```
