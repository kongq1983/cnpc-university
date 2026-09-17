# Backend Notes

这些说明只在维护适配器时读取。所有适配器都必须只使用元数据目录、PRAGMA 或数据字典视图。

## 驱动

- MySQL：`mysql-connector-python`，使用 `mysql.connector.connect`。
- PostgreSQL：`psycopg[binary]`，导入模块名为 `psycopg`。
- Oracle：`oracledb` thin mode，不依赖 Oracle Client；使用 `service_name`。
- SQLite：`sqlite3`，不安装驱动。

## 统一结果

生成器将每个 namespace 规范化为 `{catalog, schema, tables}`。表字段必须包含名称、顺序、原始类型、长度/精度/小数位、可空、默认值、自增属性和注释。关系和索引的列顺序必须来自数据库元数据，不得按字母重新排序。

枚举表名后先运行固定分表过滤，再读取字段和约束。仅在基础表存在且同组至少有两个合法日期后缀表，或同组存在从 0/1 开始的连续数字后缀表时过滤；支持 1900–2099 的 `YYYY`、合法月份的 `YYYYMM`，以及连续数字后缀，中间可无分隔符或使用 `_`、`-`。过滤过程不写入 schema，也不提供配置开关。

## 权限

PostgreSQL 需要访问 `information_schema`、`pg_catalog`；MySQL 需要读取 `information_schema`；Oracle 需要读取 `ALL_*` 数据字典视图。权限不足时停止当前表的提取并报告数据库返回的错误，不读取业务表数据作为兜底。
