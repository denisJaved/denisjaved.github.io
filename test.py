colors = """
--term-red: #ed1515;
--term-red-dim: #c0392b;
--term-green: #11d116;
--term-green-dim: #1cdc9a;
--term-orange: #f67400;
--term-orange-dim: #fdbc4b;
--term-blue: #1d99f3;
--term-blue-dim: #3daee9;
--term-purple: #9b59b6;
--term-purple-dim: #8e44ad;
--term-teal: #1abc9c;
--term-teal-dim: #16a085;
--term-white: #fcfcfc;
--term-white-dim: #fcfcfc;
--term-black: #232627;
--term-black-dim: #7f8c8d;
""".split("\n");

for i in colors:
    if len(i) < 2:
        continue
    clr = i[7:i.find(':')]
    if clr.endswith("dim"):
        continue
    print(f"#terminal .c{clr[0]} {{color: var(--term-{clr});}}")
    print(f"#terminal .c{clr[0]}d {{color: var(--term-{clr}-dim);}}")
    print(f"#terminal .bc{clr[0]} {{background-color: var(--term-{clr});}}")
    print(f"#terminal .bc{clr[0]}d {{background-color: var(--term-{clr}-dim);}}")