export type SqlSandboxValue = string | number | boolean | null;
export type SqlSandboxRow = Record<string, SqlSandboxValue>;

export interface SqlSandboxColumn {
  name: string;
  type: 'text' | 'integer' | 'boolean' | 'timestamp';
  description: string;
}

export interface SqlSandboxTable {
  name: string;
  description: string;
  columns: SqlSandboxColumn[];
  rows: SqlSandboxRow[];
}

export interface SqlSandbox {
  id: string;
  title: string;
  description: string;
  tables: SqlSandboxTable[];
  starterQueries: string[];
}

export type SqlSandboxExecutionResult =
  | {
      ok: true;
      columns: string[];
      rows: SqlSandboxRow[];
      rowCount: number;
      message: string;
    }
  | {
      ok: false;
      error: string;
      hint: string;
    };

interface ParsedSelectStatement {
  selectClause: string;
  fromClause: string;
  whereClause?: string;
  groupByClause?: string;
  orderByClause?: string;
  limitClause?: string;
}

interface TableReference {
  tableName: string;
  alias?: string;
}

interface JoinReference {
  table: TableReference;
  condition: string;
}

interface RowContext {
  values: Record<string, SqlSandboxValue>;
}

interface SelectItem {
  expression: string;
  label: string;
  aggregate?: 'count';
}

const SQL_SANDBOX: SqlSandbox = {
  id: 'coding-dojo-progress-sandbox',
  title: 'CodingDojo Lernfortschritt',
  description: 'Eine lokale Testdatenbank mit Profilen, Lektionen und abgeschlossenen Lernständen.',
  tables: [
    {
      name: 'profiles',
      description: 'Lernprofile mit XP und Tagesziel.',
      columns: [
        column('id', 'text', 'Eindeutige User-ID'),
        column('name', 'text', 'Anzeigename'),
        column('level', 'integer', 'Aktuelles Level'),
        column('daily_goal', 'integer', 'Tagesziel in XP')
      ],
      rows: [
        { id: 'user_123', name: 'Dominik', level: 4, daily_goal: 80 },
        { id: 'user_456', name: 'Mara', level: 2, daily_goal: 50 },
        { id: 'user_789', name: 'Alex', level: 6, daily_goal: 120 }
      ]
    },
    {
      name: 'lessons',
      description: 'Lektionen aus verschiedenen Kursen.',
      columns: [
        column('id', 'text', 'Eindeutige Lektions-ID'),
        column('course_id', 'text', 'Kurszuordnung'),
        column('title', 'text', 'Lektionstitel'),
        column('xp_reward', 'integer', 'XP für den Abschluss')
      ],
      rows: [
        { id: 'sql-select', course_id: 'sql', title: 'SELECT Grundlagen', xp_reward: 25 },
        { id: 'sql-joins', course_id: 'sql', title: 'JOINs verstehen', xp_reward: 35 },
        { id: 'python-fstrings', course_id: 'python', title: 'F-Strings sicher nutzen', xp_reward: 20 },
        { id: 'react-state', course_id: 'react', title: 'State sauber modellieren', xp_reward: 40 }
      ]
    },
    {
      name: 'lesson_progress',
      description: 'Welche Lektionen abgeschlossen wurden.',
      columns: [
        column('user_id', 'text', 'Referenz auf profiles.id'),
        column('lesson_id', 'text', 'Referenz auf lessons.id'),
        column('completed_at', 'timestamp', 'Zeitpunkt des Abschlusses'),
        column('xp', 'integer', 'Gutgeschriebene XP')
      ],
      rows: [
        { user_id: 'user_123', lesson_id: 'sql-select', completed_at: '2026-06-10T08:15:00.000Z', xp: 25 },
        { user_id: 'user_123', lesson_id: 'sql-joins', completed_at: '2026-06-12T09:20:00.000Z', xp: 35 },
        { user_id: 'user_456', lesson_id: 'sql-joins', completed_at: '2026-06-13T07:45:00.000Z', xp: 35 },
        { user_id: 'user_789', lesson_id: 'python-fstrings', completed_at: '2026-06-09T13:05:00.000Z', xp: 20 },
        { user_id: 'user_789', lesson_id: 'react-state', completed_at: '2026-06-11T16:30:00.000Z', xp: 40 }
      ]
    }
  ],
  starterQueries: [
    "select lesson_id, completed_at from lesson_progress where user_id = 'user_123' order by completed_at desc;",
    [
      'select profiles.name, lessons.title',
      'from lesson_progress',
      'join profiles on lesson_progress.user_id = profiles.id',
      'join lessons on lesson_progress.lesson_id = lessons.id',
      "where lessons.course_id = 'sql'",
      'order by lesson_progress.completed_at asc;'
    ].join('\n'),
    "select user_id, count(*) as completed_lessons from lesson_progress group by user_id order by completed_lessons desc;"
  ]
};

export function getSqlSandbox(): SqlSandbox {
  return SQL_SANDBOX;
}

export function executeSqlSandboxQuery(sandbox: SqlSandbox, sqlText: string): SqlSandboxExecutionResult {
  const statement = normalizeStatement(sqlText);

  if (!statement) {
    return errorResult('Schreibe zuerst eine SQL-Abfrage.', 'Starte zum Beispiel mit SELECT * FROM profiles;');
  }

  if (statement.slice(0, -1).includes(';')) {
    return errorResult('Bitte führe immer nur eine SQL-Abfrage auf einmal aus.', 'Trenne mehrere Ideen in einzelne Testläufe.');
  }

  const singleStatement = statement.endsWith(';') ? statement.slice(0, -1).trim() : statement;
  if (!/^select\s/i.test(singleStatement)) {
    return errorResult(
      'Die lokale Übungsdatenbank führt aktuell nur SELECT-Abfragen aus.',
      'Die Testdaten bleiben absichtlich unverändert. Übe CREATE, INSERT, UPDATE und DELETE im Editor, aber führe hier SELECT gegen die Testdaten aus.'
    );
  }

  try {
    return executeSelectStatement(sandbox, singleStatement);
  } catch (error) {
    return errorResult(error instanceof Error ? error.message : 'Die SQL-Abfrage konnte nicht ausgeführt werden.', 'Prüfe Tabellennamen, Spaltennamen und die Reihenfolge SELECT, FROM, WHERE, ORDER BY.');
  }
}

function executeSelectStatement(sandbox: SqlSandbox, statement: string): SqlSandboxExecutionResult {
  const parsed = parseSelectStatement(statement);
  const { baseTable, baseReference, joins } = parseFromClause(parsed.fromClause, sandbox);
  const selectItems = parseSelectItems(parsed.selectClause);
  const hasAggregate = selectItems.some((item) => item.aggregate);
  let contexts = baseTable.rows.map((row) => createContext(baseTable, baseReference.alias, row));

  for (const join of joins) {
    const joinTable = getTable(sandbox, join.table.tableName);
    const joinContexts = joinTable.rows.map((row) => createContext(joinTable, join.table.alias, row));
    contexts = contexts.flatMap((context) =>
      joinContexts
        .map((joinContext) => ({ values: { ...context.values, ...joinContext.values } }))
        .filter((joinedContext) => evaluateCondition(joinedContext, join.condition))
    );
  }

  if (parsed.whereClause) {
    contexts = contexts.filter((context) => evaluateWhereClause(context, parsed.whereClause!));
  }

  if (hasAggregate || parsed.groupByClause) {
    return executeAggregateSelect(contexts, selectItems, parsed);
  }

  if (parsed.orderByClause) {
    contexts = sortContexts(contexts, parsed.orderByClause);
  }

  if (parsed.limitClause) {
    contexts = contexts.slice(0, parseLimit(parsed.limitClause));
  }

  const rows = contexts.map((context) => projectContext(context, selectItems, baseTable));
  const columns = resolveColumns(selectItems, baseTable);
  return {
    ok: true,
    columns,
    rows,
    rowCount: rows.length,
    message: `${rows.length} Zeile${rows.length === 1 ? '' : 'n'} gefunden.`
  };
}

function executeAggregateSelect(
  contexts: RowContext[],
  selectItems: SelectItem[],
  parsed: ParsedSelectStatement
): SqlSandboxExecutionResult {
  const groupExpressions = parsed.groupByClause ? splitCommaSeparated(parsed.groupByClause) : [];
  const groups = new Map<string, RowContext[]>();

  for (const context of contexts) {
    const key = groupExpressions.length > 0
      ? JSON.stringify(groupExpressions.map((expression) => readExpression(context, expression)))
      : '__all__';
    groups.set(key, [...(groups.get(key) ?? []), context]);
  }

  let rows = Array.from(groups.values()).map((group) => projectAggregateGroup(group, selectItems));

  if (parsed.orderByClause) {
    rows = sortRows(rows, parsed.orderByClause);
  }

  if (parsed.limitClause) {
    rows = rows.slice(0, parseLimit(parsed.limitClause));
  }

  return {
    ok: true,
    columns: selectItems.map((item) => item.label),
    rows,
    rowCount: rows.length,
    message: `${rows.length} Gruppe${rows.length === 1 ? '' : 'n'} gefunden.`
  };
}

function parseSelectStatement(statement: string): ParsedSelectStatement {
  const match = statement.match(/^select\s+(.+?)\s+from\s+(.+)$/i);
  if (!match) {
    throw new Error('Eine SELECT-Abfrage braucht mindestens SELECT und FROM.');
  }

  const [, selectClause, remainder] = match;
  const clauses = findClausePositions(remainder);
  const firstClause = clauses[0];
  const fromClause = (firstClause ? remainder.slice(0, firstClause.index) : remainder).trim();

  if (!fromClause) {
    throw new Error('Nach FROM fehlt der Tabellenname.');
  }

  const parsed: ParsedSelectStatement = {
    selectClause: selectClause.trim(),
    fromClause
  };

  clauses.forEach((clause, index) => {
    const nextClause = clauses[index + 1];
    const value = remainder.slice(clause.contentStart, nextClause?.index ?? remainder.length).trim();
    if (clause.name === 'where') parsed.whereClause = value;
    if (clause.name === 'groupBy') parsed.groupByClause = value;
    if (clause.name === 'orderBy') parsed.orderByClause = value;
    if (clause.name === 'limit') parsed.limitClause = value;
  });

  return parsed;
}

function findClausePositions(input: string) {
  const clausePatterns = [
    { name: 'where', regex: /\swhere\s/i },
    { name: 'groupBy', regex: /\sgroup\s+by\s/i },
    { name: 'orderBy', regex: /\sorder\s+by\s/i },
    { name: 'limit', regex: /\slimit\s/i }
  ] as const;

  return clausePatterns
    .map((clause) => {
      const match = input.match(clause.regex);
      return match && typeof match.index === 'number'
        ? { name: clause.name, index: match.index, contentStart: match.index + match[0].length }
        : null;
    })
    .filter((clause): clause is NonNullable<typeof clause> => clause !== null)
    .sort((a, b) => a.index - b.index);
}

function parseFromClause(fromClause: string, sandbox: SqlSandbox) {
  const firstJoinIndex = fromClause.search(/\sjoin\s/i);
  const basePart = firstJoinIndex >= 0 ? fromClause.slice(0, firstJoinIndex) : fromClause;
  const joinPart = firstJoinIndex >= 0 ? fromClause.slice(firstJoinIndex).trim() : '';
  const baseReference = parseTableReference(basePart);
  const baseTable = getTable(sandbox, baseReference.tableName);
  const joins = parseJoins(joinPart);

  return { baseTable, baseReference, joins };
}

function parseJoins(joinPart: string): JoinReference[] {
  const joins: JoinReference[] = [];
  let remaining = joinPart.trim();

  while (remaining) {
    const match = remaining.match(/^join\s+(.+?)\s+on\s+(.+?)(?=\s+join\s+|$)/i);
    if (!match) {
      throw new Error('JOINs brauchen die Form JOIN tabelle ON linke_spalte = rechte_spalte.');
    }

    joins.push({
      table: parseTableReference(match[1]),
      condition: match[2].trim()
    });
    remaining = remaining.slice(match[0].length).trim();
  }

  return joins;
}

function parseTableReference(rawReference: string): TableReference {
  const tokens = rawReference.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) throw new Error('Nach FROM oder JOIN fehlt der Tabellenname.');
  if (tokens.length === 1) return { tableName: tokens[0] };
  if (tokens.length === 2) return { tableName: tokens[0], alias: tokens[1] };
  if (tokens.length === 3 && tokens[1].toLowerCase() === 'as') return { tableName: tokens[0], alias: tokens[2] };
  throw new Error(`Die Tabellenreferenz "${rawReference.trim()}" konnte nicht gelesen werden.`);
}

function parseSelectItems(selectClause: string): SelectItem[] {
  const parts = splitCommaSeparated(selectClause);
  if (parts.length === 0) throw new Error('SELECT braucht mindestens eine Spalte.');

  return parts.map((part) => {
    const aliasMatch = part.match(/^(.+?)\s+as\s+([a-z_][\w]*)$/i);
    const expression = (aliasMatch ? aliasMatch[1] : part).trim();
    const label = aliasMatch ? aliasMatch[2] : expression;
    const aggregate = /^count\s*\(\s*\*\s*\)$/i.test(expression) ? 'count' : undefined;
    return { expression, label, aggregate };
  });
}

function projectContext(context: RowContext, selectItems: SelectItem[], baseTable: SqlSandboxTable): SqlSandboxRow {
  if (selectItems.length === 1 && selectItems[0].expression === '*') {
    return Object.fromEntries(baseTable.columns.map((columnItem) => [columnItem.name, readExpression(context, columnItem.name)]));
  }

  return Object.fromEntries(selectItems.map((item) => [item.label, readExpression(context, item.expression)]));
}

function projectAggregateGroup(group: RowContext[], selectItems: SelectItem[]): SqlSandboxRow {
  const firstContext = group[0];

  return Object.fromEntries(
    selectItems.map((item) => {
      if (item.aggregate === 'count') return [item.label, group.length];
      if (!firstContext) return [item.label, null];
      return [item.label, readExpression(firstContext, item.expression)];
    })
  );
}

function resolveColumns(selectItems: SelectItem[], baseTable: SqlSandboxTable): string[] {
  if (selectItems.length === 1 && selectItems[0].expression === '*') {
    return baseTable.columns.map((columnItem) => columnItem.name);
  }
  return selectItems.map((item) => item.label);
}

function evaluateWhereClause(context: RowContext, whereClause: string): boolean {
  return splitByAnd(whereClause).every((condition) => evaluateCondition(context, condition));
}

function evaluateCondition(context: RowContext, condition: string): boolean {
  const match = condition.match(/^(.+?)\s*(=|!=|<>|>=|<=|>|<)\s*(.+)$/);
  if (!match) {
    throw new Error(`Die Bedingung "${condition}" konnte nicht gelesen werden.`);
  }

  const [, leftExpression, operator, rightExpression] = match;
  const left = readExpression(context, leftExpression);
  const right = readExpression(context, rightExpression);

  if (operator === '=') return compareValues(left, right) === 0;
  if (operator === '!=' || operator === '<>') return compareValues(left, right) !== 0;
  if (operator === '>') return compareValues(left, right) > 0;
  if (operator === '>=') return compareValues(left, right) >= 0;
  if (operator === '<') return compareValues(left, right) < 0;
  if (operator === '<=') return compareValues(left, right) <= 0;
  return false;
}

function sortContexts(contexts: RowContext[], orderByClause: string): RowContext[] {
  const orderItems = parseOrderItems(orderByClause);
  return [...contexts].sort((left, right) => {
    for (const item of orderItems) {
      const comparison = compareValues(readExpression(left, item.expression), readExpression(right, item.expression));
      if (comparison !== 0) return item.direction === 'desc' ? comparison * -1 : comparison;
    }
    return 0;
  });
}

function sortRows(rows: SqlSandboxRow[], orderByClause: string): SqlSandboxRow[] {
  const orderItems = parseOrderItems(orderByClause);
  return [...rows].sort((left, right) => {
    for (const item of orderItems) {
      const comparison = compareValues(readProjectedValue(left, item.expression), readProjectedValue(right, item.expression));
      if (comparison !== 0) return item.direction === 'desc' ? comparison * -1 : comparison;
    }
    return 0;
  });
}

function parseOrderItems(orderByClause: string) {
  return splitCommaSeparated(orderByClause).map((part) => {
    const match = part.match(/^(.+?)(?:\s+(asc|desc))?$/i);
    if (!match) throw new Error(`ORDER BY "${part}" konnte nicht gelesen werden.`);
    return {
      expression: match[1].trim(),
      direction: (match[2]?.toLowerCase() === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc'
    };
  });
}

function parseLimit(limitClause: string): number {
  const limit = Number.parseInt(limitClause, 10);
  if (!Number.isFinite(limit) || limit < 0) {
    throw new Error('LIMIT braucht eine positive Zahl.');
  }
  return limit;
}

function readExpression(context: RowContext, expression: string): SqlSandboxValue {
  const trimmed = expression.trim();
  const lower = trimmed.toLowerCase();
  if ((trimmed.startsWith("'") && trimmed.endsWith("'")) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
    return trimmed.slice(1, -1);
  }
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);
  if (lower === 'true') return true;
  if (lower === 'false') return false;
  if (lower === 'null') return null;
  if (Object.prototype.hasOwnProperty.call(context.values, lower)) return context.values[lower];
  throw new Error(`Die Spalte "${trimmed}" ist in der Testdatenbank nicht bekannt.`);
}

function readProjectedValue(row: SqlSandboxRow, expression: string): SqlSandboxValue {
  if (Object.prototype.hasOwnProperty.call(row, expression)) return row[expression];
  const lowerExpression = expression.toLowerCase();
  const matchingKey = Object.keys(row).find((key) => key.toLowerCase() === lowerExpression);
  return matchingKey ? row[matchingKey] : null;
}

function createContext(table: SqlSandboxTable, alias: string | undefined, row: SqlSandboxRow): RowContext {
  const values: Record<string, SqlSandboxValue> = {};

  for (const columnItem of table.columns) {
    const value = row[columnItem.name];
    const columnName = columnItem.name.toLowerCase();
    const tableName = table.name.toLowerCase();
    values[`${tableName}.${columnName}`] = value;
    if (alias) values[`${alias.toLowerCase()}.${columnName}`] = value;
    if (!Object.prototype.hasOwnProperty.call(values, columnName)) {
      values[columnName] = value;
    }
  }

  return { values };
}

function getTable(sandbox: SqlSandbox, tableName: string): SqlSandboxTable {
  const table = sandbox.tables.find((candidate) => candidate.name.toLowerCase() === tableName.toLowerCase());
  if (!table) throw new Error(`Die Tabelle "${tableName}" existiert in der Testdatenbank nicht.`);
  return table;
}

function normalizeStatement(sqlText: string): string {
  return sqlText
    .split('\n')
    .map((line) => line.replace(/--.*$/, ''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitCommaSeparated(input: string): string[] {
  return splitOutsideQuotes(input, ',').map((part) => part.trim()).filter(Boolean);
}

function splitByAnd(input: string): string[] {
  return splitOutsideQuotesByKeyword(input, 'and').map((part) => part.trim()).filter(Boolean);
}

function splitOutsideQuotes(input: string, separator: string): string[] {
  const parts: string[] = [];
  let current = '';
  let quote: string | null = null;

  for (const character of input) {
    if ((character === "'" || character === '"') && quote === null) {
      quote = character;
    } else if (character === quote) {
      quote = null;
    }

    if (character === separator && quote === null) {
      parts.push(current);
      current = '';
    } else {
      current += character;
    }
  }

  parts.push(current);
  return parts;
}

function splitOutsideQuotesByKeyword(input: string, keyword: string): string[] {
  const parts: string[] = [];
  let current = '';
  let quote: string | null = null;
  const lowerInput = input.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if ((character === "'" || character === '"') && quote === null) {
      quote = character;
    } else if (character === quote) {
      quote = null;
    }

    const keywordStartsHere = quote === null
      && lowerInput.slice(index, index + lowerKeyword.length) === lowerKeyword
      && isKeywordBoundary(input[index - 1])
      && isKeywordBoundary(input[index + lowerKeyword.length]);

    if (keywordStartsHere) {
      parts.push(current);
      current = '';
      index += lowerKeyword.length - 1;
    } else {
      current += character;
    }
  }

  parts.push(current);
  return parts;
}

function isKeywordBoundary(character: string | undefined): boolean {
  return character === undefined || /\s|\(|\)/.test(character);
}

function compareValues(left: SqlSandboxValue, right: SqlSandboxValue): number {
  if (left === right) return 0;
  if (left === null) return -1;
  if (right === null) return 1;
  if (typeof left === 'number' && typeof right === 'number') return left - right;
  return String(left).localeCompare(String(right));
}

function column(name: string, type: SqlSandboxColumn['type'], description: string): SqlSandboxColumn {
  return { name, type, description };
}

function errorResult(error: string, hint: string): SqlSandboxExecutionResult {
  return { ok: false, error, hint };
}
