export function formatTime(e:Date):string {
    const interval = Math.round((Date.now() - e.getTime()) / 1000);
    if (interval < 5)
        return ("À l'instant.");
    if (interval < 60)
        return "Il y a "+interval+" secondes.";
    if (interval < 90)
        return "Il y a 1 minute.";
    if (interval < 3600)
        return "Il y a "+Math.round(interval/60)+" minutes.";
    if (interval < 5400)
        return "Il y a 1 heure.";
    if (interval < 86400)
        return "Il y a "+Math.round(interval/3600)+" heures.";
    return e.toDateString();
}