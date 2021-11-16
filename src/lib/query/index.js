/**
 * This module contains code for processing the query and creating
 * a data-structure, using which we can get results for the query.
 */

/**
 * Query Structure
 *
 * Basic Operators
 *
 * ()   - parenthesis =>  used for giving higher precedence
 * &    - and         =>  and operator  (binary)
 * |    - or          =>  or operator   (binary)
 * !    - not         =>  not operator  (unary)
 *
 * Advanced Operators
 *
 * /0 - positional    => proximity queries  (binary)
 * /s - soundex       => soundex queries    (unary)
 * "" - quotes        => bi-word queries    (unary)
 */

export { default as Parser } from './parser';
