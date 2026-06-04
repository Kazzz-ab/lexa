/**
 * security.js - Enhanced security middleware
  * Protects against: phishing, DDoS, and spam attacks
   */
   import rateLimit from 'express-rate-limit';
   import slowDown from 'express-slow-down';

   // --- Anti-DDoS: Speed Limiter ---
   // Gradually slows responses after threshold - penalises bots without hard-blocking
   export const speedLimiter = slowDown({
     windowMs: 15 * 60 * 1000,
       delayAfter: 50,
         delayMs: (hits) => hits * 200,
           maxDelayMs: 5000,
           });

           // --- Anti-DDoS: Strict Write Limiter ---
           // Very tight cap for write endpoints (POST/PUT/PATCH/DELETE)
           export const writeLimiter = rateLimit({
             windowMs: 10 * 60 * 1000,
               max: 30,
                 standardHeaders: true,
                   legacyHeaders: false,
                     message: { message: 'Too many write requests, please try again later' },
                     });

                     // --- Anti-Spam: Input Sanitizer ---
                     // Strips HTML tags, null bytes, and excessively long strings from req.body
                     export const sanitizeInput = (req, _res, next) => {
                       if (req.body && typeof req.body === 'object') {
                           req.body = sanitizeObj(req.body);
                             }
                               next();
                               };

                               function sanitizeObj(obj, depth = 0) {
                                 if (depth > 5) return {};
                                   const clean = {};
                                     for (const [key, val] of Object.entries(obj)) {
                                         if (typeof val === 'string') {
                                               let v = val.replace(/<[^>]*>/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
                                                     clean[key] = v.substring(0, 4000);
                                                         } else if (Array.isArray(val)) {
                                                               clean[key] = val.slice(0, 100).map(item =>
                                                                       typeof item === 'object' && item !== null ? sanitizeObj(item, depth + 1)
                                                                                 : typeof item === 'string' ? item.replace(/<[^>]*>/g, '').substring(0, 4000) : item);
                                                                                     } else if (val !== null && typeof val === 'object') {
                                                                                           clean[key] = sanitizeObj(val, depth + 1);
                                                                                               } else {
                                                                                                     clean[key] = val;
                                                                                                         }
                                                                                                           }
                                                                                                             return clean;
                                                                                                             }
                                                                                                             
                                                                                                             // --- Anti-Phishing: HTTPS enforcer and referer checker ---
                                                                                                             export const antiPhishingHeaders = (req, res, next) => {
                                                                                                               if (process.env.NODE_ENV === 'production' &&
                                                                                                                     req.headers['x-forwarded-proto'] &&
                                                                                                                           req.headers['x-forwarded-proto'] !== 'https') {
                                                                                                                               return res.redirect(301, 'https://' + req.headers.host + req.url);
                                                                                                                                 }
                                                                                                                                   const referer = req.headers['referer'] || req.headers['referrer'] || '';
                                                                                                                                     if (referer.length > 2048) {
                                                                                                                                         return res.status(400).json({ message: 'Invalid request' });
                                                                                                                                           }
                                                                                                                                             next();
                                                                                                                                             };
                                                                                                                                             
                                                                                                                                             // --- Anti-Spam: Honeypot field checker ---
                                                                                                                                             export const honeypotCheck = (honeypotField = '_trap') => (req, res, next) => {
                                                                                                                                               if (req.body && req.body[honeypotField] !== undefined && req.body[honeypotField] !== '') {
                                                                                                                                                   return res.status(200).json({ message: 'Submission received' });
                                                                                                                                                     }
                                                                                                                                                       next();
                                                                                                                                                       };
                                                                                                                                                       
                                                                                                                                                       // --- Anti-Spam: Duplicate submission blocker ---
                                                                                                                                                       const recentHashes = new Map();
                                                                                                                                                       export const duplicateSubmissionBlock = (req, res, next) => {
                                                                                                                                                         if (!req.body || Object.keys(req.body).length === 0) return next();
                                                                                                                                                           const hash = simpleHash(JSON.stringify(req.body) + (req.ip || ''));
                                                                                                                                                             const now = Date.now();
                                                                                                                                                               const last = recentHashes.get(hash);
                                                                                                                                                                 if (last && now - last < 5000) {
                                                                                                                                                                     return res.status(429).json({ message: 'Duplicate submission detected, please wait' });
                                                                                                                                                                       }
                                                                                                                                                                         recentHashes.set(hash, now);
                                                                                                                                                                           if (recentHashes.size > 500) {
                                                                                                                                                                               for (const [k, v] of recentHashes.entries()) {
                                                                                                                                                                                     if (now - v > 60000) recentHashes.delete(k);
                                                                                                                                                                                         }
                                                                                                                                                                                           }
                                                                                                                                                                                             next();
                                                                                                                                                                                             };
                                                                                                                                                                                             
                                                                                                                                                                                             function simpleHash(str) {
                                                                                                                                                                                               let hash = 0;
                                                                                                                                                                                                 for (let i = 0; i < str.length; i++) {
                                                                                                                                                                                                     hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
                                                                                                                                                                                                       }
                                                                                                                                                                                                         return hash.toString(16);
                                                                                                                                                                                                         }
