// ─── Param Registry ───────────────────────────────────────────────────────────

/**
 * Pushes a value into the params array and returns its $N placeholder string.
 * @param {Array}  params - The mutable params array passed to pool.query()
 * @param {*}      value  - The value to bind
 * @returns {string}        e.g. "$1", "$2", …
 */
export const addParam = (params, value) => {
    params.push(value);
    return `$${params.length}`;
};

// ─── Text Helpers ─────────────────────────────────────────────────────────────

/**
 * Trims a string and returns null if blank/nullish — safe to store or compare.
 * @param {*} value
 * @returns {string|null}
 */
export const normalizeText = (value) => {
    if (value === null || value === undefined) return null;
    const trimmed = String(value).trim();
    return trimmed.length > 0 ? trimmed : null;
};

/**
 * Escapes special LIKE pattern characters so user input is treated as a literal.
 * Escapes: \ % _
 * @param {string} str
 * @returns {string}
 */
export const escapeLikePattern = (str) =>
    str.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');

// ─── Boolean Helper ───────────────────────────────────────────────────────────

/**
 * Coerces a filter value to a strict boolean or null.
 * Accepts: true/false, "true"/"false", "1"/"0", "yes"/"no"
 * @param {*} value
 * @returns {boolean|null}
 */
export const parseBooleanFilter = (value) => {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'boolean') return value;
    const v = String(value).trim().toLowerCase();
    if (['true',  '1', 'yes'].includes(v)) return true;
    if (['false', '0', 'no' ].includes(v)) return false;
    return null;
};

// ─── Number Helper ────────────────────────────────────────────────────────────

/**
 * Returns a finite number, falling back to 0 for null / undefined / NaN.
 * @param {*} value
 * @returns {number}
 */
export const coalesceNumber = (value) => {
    const n = Number(value);
    return isFinite(n) ? n : 0;
};

// ─── WHERE Clause Builders ────────────────────────────────────────────────────

/**
 * Adds an exact-match condition ( column = $N ) if value is non-null.
 *
 * @param {string[]} where  - Mutable WHERE-clause array
 * @param {Array}    params - Mutable params array
 * @param {string}   column - Fully-qualified column name, e.g. 't.thana_id'
 * @param {*}        value  - Filter value (skipped if null / undefined / '')
 */
export const addExactMatch = (where, params, column, value) => {
    const normalized = normalizeText(value);
    if (normalized === null) return;
    const placeholder = addParam(params, normalized);
    where.push(`${column} = ${placeholder}`);
};

/**
 * Adds a case-insensitive LIKE condition ( column ILIKE $N ) if value is non-null.
 * The value is automatically wrapped in % … % wildcards.
 *
 * @param {string[]} where
 * @param {Array}    params
 * @param {string}   column
 * @param {*}        value
 */
export const addInsensitiveLike = (where, params, column, value) => {
    const normalized = normalizeText(value);
    if (normalized === null) return;
    const placeholder = addParam(params, `%${escapeLikePattern(normalized)}%`);
    where.push(`${column} ILIKE ${placeholder} ESCAPE '\\'`);
};

/**
 * Adds a date-range condition ( column >= from AND column <= to ).
 * Either bound is optional — only the provided bounds are added.
 *
 * @param {string[]} where
 * @param {Array}    params
 * @param {string}   column - Should already include any cast, e.g. 'g.submitted_at::date'
 * @param {*}        from   - Lower bound (inclusive)
 * @param {*}        to     - Upper bound (inclusive)
 */
export const addDateRange = (where, params, column, from, to) => {
    const normalizedFrom = normalizeText(from);
    const normalizedTo   = normalizeText(to);
    if (normalizedFrom !== null) {
        const placeholder = addParam(params, normalizedFrom);
        where.push(`${column} >= ${placeholder}`);
    }
    if (normalizedTo !== null) {
        const placeholder = addParam(params, normalizedTo);
        where.push(`${column} <= ${placeholder}`);
    }
};

/**
 * Adds a numeric range condition ( column >= min AND column <= max ).
 * Either bound is optional — only the provided bounds are added.
 *
 * @param {string[]} where
 * @param {Array}    params
 * @param {string}   column
 * @param {*}        min    - Lower bound (inclusive)
 * @param {*}        max    - Upper bound (inclusive)
 */
export const addNumericRange = (where, params, column, min, max) => {
    const parsedMin = normalizeText(min);
    const parsedMax = normalizeText(max);
    if (parsedMin !== null && isFinite(Number(parsedMin))) {
        const placeholder = addParam(params, Number(parsedMin));
        where.push(`${column} >= ${placeholder}`);
    }
    if (parsedMax !== null && isFinite(Number(parsedMax))) {
        const placeholder = addParam(params, Number(parsedMax));
        where.push(`${column} <= ${placeholder}`);
    }
};