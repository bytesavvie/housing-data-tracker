export function csvToArray(text: string) {
  let p = "",
    row = [""],
    i = 0,
    r = 0,
    s = !0,
    l;
  const ret = [row];
  for (l of text) {
    if ('"' === l) {
      if (s && l === p) row[i] += l;
      s = !s;
    } else if ("," === l && s) l = row[++i] = "";
    else if ("\n" === l && s) {
      const tempRow = row[i];
      if ("\r" === p && tempRow) row[i] = tempRow.slice(0, -1);
      row = ret[++r] = [(l = "")];
      i = 0;
    } else row[i] += l;
    p = l;
  }
  return ret;
}

export const extractStateFromName = (title: string | undefined) => {
  if (!title) return;

  let state = title.split(",")[1];
  if (state) {
    state = state.trim().slice(0, 2).toLowerCase();
    return state;
  }
};
