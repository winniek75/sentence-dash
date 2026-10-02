/**
 * 起動設定まわりの共通定義。
 *  - 読みかたモード（じっくり読む / 速読チャレンジ）
 *  - 1回の文章数（2 / 4 / 8）
 *  - URLパラメータによる直接起動（ポータルの「今日の10分コース」用）
 *
 * ディープリンク書式:
 *   ?level=easy|medium|hard  （1|2|3 でも可）
 *   &mode=careful|speed      （careful = じっくり読む・時間制限なし / speed = 速読チャレンジ。
 *                              practice, slow は careful、challenge, timed は speed の別名）
 *   &count=1〜8              （文章数。メニューの選択肢は 2 / 4 / 8）
 * どれか1つでも有効な指定があればメニューを飛ばして直接開始する。
 * 省略した項目は level=保存済みの選択（なければ easy）、mode=careful、count=2。
 */

export type Level = 'easy' | 'medium' | 'hard';
export type GameMode = 'careful' | 'speed';

export const PORTAL_URL = 'https://wise-english-portal.vercel.app';
export const COUNT_OPTIONS = [2, 4, 8];
export const DEFAULT_COUNT = 2;
export const DEFAULT_MODE: GameMode = 'careful';
export const MAX_COUNT = 8;

/** 日本語テキスト用フォント（index.html で Noto Sans JP を読み込み済み） */
export const JP_FONT = '"Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif';

export const MODE_LABEL: Record<GameMode, string> = {
    careful: 'じっくり読む',
    speed: '速読チャレンジ'
};

export interface LaunchParams {
    level?: Level;
    mode?: GameMode;
    count?: number;
}

const LEVEL_ALIASES: Record<string, Level> = {
    easy: 'easy', '1': 'easy',
    medium: 'medium', normal: 'medium', '2': 'medium',
    hard: 'hard', '3': 'hard'
};

const MODE_ALIASES: Record<string, GameMode> = {
    careful: 'careful', practice: 'careful', slow: 'careful', jikkuri: 'careful',
    speed: 'speed', challenge: 'speed', timed: 'speed', sokudoku: 'speed'
};

export function parseLaunchParams(search: string): LaunchParams | null {
    let params: URLSearchParams;
    try {
        params = new URLSearchParams(search);
    } catch (_e) {
        return null;
    }
    const out: LaunchParams = {};

    const level = LEVEL_ALIASES[(params.get('level') || '').toLowerCase()];
    if (level) out.level = level;

    const mode = MODE_ALIASES[(params.get('mode') || '').toLowerCase()];
    if (mode) out.mode = mode;

    const rawCount = params.get('count');
    if (rawCount !== null && /^\d+$/.test(rawCount)) {
        const n = parseInt(rawCount, 10);
        if (n >= 1) out.count = Math.min(n, MAX_COUNT);
    }

    return (out.level || out.mode || out.count) ? out : null;
}

let pending: LaunchParams | null =
    typeof window !== 'undefined' ? parseLaunchParams(window.location.search) : null;

/** URL指定の起動設定を1回だけ取り出す（2回目以降は null = ふつうのメニュー） */
export function consumeLaunchParams(): LaunchParams | null {
    const p = pending;
    pending = null;
    return p;
}

/** ポータル等の iframe に埋め込まれているか */
export function isEmbedded(): boolean {
    try {
        return window.parent !== window;
    } catch (_e) {
        return true;
    }
}

export function goToPortal(): void {
    window.location.href = PORTAL_URL;
}
