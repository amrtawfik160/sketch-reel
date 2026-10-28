# Art: the Excalidraw board, dark and light

The look is Excalidraw's own dark mode, exactly, and its light mode when a reel mixes the two (see Light and dark boards below). Someone who uses Excalidraw should recognise it in one frame. [`look.png`](look.png) shows eight frames of the Valor breakdown reel, dark and light boards mixed.

## Colour

`assets/excal_theme.js` holds the colours.

- **`dk(hex)` is Excalidraw's dark-mode filter in code:** invert 93%, then rotate the hue 180°. Pass every light-theme Excalidraw colour through it; never pick dark colours by eye.
- **Theme constants:**
  - `PAPER` is the #121212 canvas, `INK` the light-grey ink (#d3d3d3) and `INK2` the secondary ink.
  - `EX` holds the palette: `blue`/`blueF`, `green`/`greenF`, `red`/`redF`, `orange`, `yellowF`, `violet`/`violetF`, `gray`/`grayF`. `xF` is the fill that pairs with stroke `x`.
- **One colour per role, held for the whole reel:**

  | Colour | Role |
  |---|---|
  | blue | the hero (Valor's eyes, name tag, the spoken caption word) |
  | violet | the boss and the decisions that reach him |
  | green | done or shipped |
  | red | the problem, the critic, STOP |
  | yellow fill | sticky notes |
  | orange | values in code and highlights |

- **The theme re-skins the runtime too.** `K` (so kit helpers draw in ink), Excalifont captions with the spoken word in blue, and the follow card (a light-blue hand-lettered button with an ink border).

## Light and dark boards

The creator asked for both themes mixed, by story section, and liked the result (`examples/valor_breakdown/`). `assets/excal_theme.js` supports both and stays dark unless a reel switches:

- **Two palettes:** `DT` (dark: `PAPER` #121212, `INK` #d3d3d3, `EX` through `dk()`) and `LT` (light: `PAPER` #ffffff, `INK` #1e1e1e, `INK2` #495057, `EX` = `EXL`, the raw Excalidraw colours). A scene draws each section with the palette of its theme; never mix the two inside one section.
- **`THEME_SW = [[t, "light" | "dark"], ...]`,** set in `scene()`, tells the captions which theme is on screen. Each caption phrase takes the palette of the theme on screen when it starts.
- **Switch only at a line start,** about 0.03 s before the line's `_start`, when the outgoing section is done. Give each section its own board, so nothing from the old theme stays on screen.
- **One switch style for the whole reel: the wipe, or the tilt on a station board** (see One board with stations below). The wipe (`wipe(t, toDark, dir)` in `examples/valor_breakdown/scenes.js`) is a hachured band in the next theme's paper colour that sweeps across in 0.32 s, alternating direction. When it covers the frame, the ground, the board and the camera cut together. The wipe layer draws above the captions, so the band covers the outgoing caption; a caption left on top showed in the old colours with a thick outline over the new board.
- **Sections that worked:** dark for the hook, the machinery and the stop; light for the friendly request, the receipt and ledger, and the ending. Five switches in 102 s felt intentional, not busy.
- **Check every colour in both themes.** Grey annotations that read on white were too dim on #121212; on dark boards use a light grey (#b9bec5) for secondary text.
- **Tom's real photo** goes inside a drawn ring or polaroid frame (`<image>` clipped to a circle, with a rough.js ring on top), so it belongs to the board.

## One board with stations (the connected story)

The look the creator loved most (the quantization story, `examples/quant_story/src/story4.js`): the whole reel is one board that is never cleared, and the camera travels across it.

- **Stations on a grid:** 3 columns × 2 rows (`COLX = [0, 1200, 2400]`, `ROWY = [0, 2700]`). Each station holds one step of the story: the theory, the numbers, the answer on the top row; the quote, the daily test, the dial on the bottom row. Drawings stay where they were made, so when the camera passes or pulls back, the viewer sees the story so far.
- **The two rows are the two themes:** the top row is the dark board and the bottom row the light board. The theme changes when the camera tilts across the edge between them, on the line that turns the story ("So I checked"). It replaced the wipe: one switch, and it is caused by the story.
- **The grounds are drawn edge to edge** in an unclipped copy of the camera group placed before `SAFE` (`BGO`), so the margins outside the safe frame show the right colour during the tilt.
- **The cast lives in screen space, always on screen:** the narrator on the left, the character (Sam: red cap, phone) on the right, both about 1.6× the usual figure size so their reactions read. They walk in place while the camera travels. The character's bubbles are size 60+ and change on the word that causes them ("see?!" on "faster and cheaper", popped on "So I checked", "hmm…" on "no drop", "aha!" on "thinks less", "thanks!" on "tip").
- **Frame one shows the character and the belief:** Sam frowning at "Claude got dumber!" on frame 0; the theory cloud grows from his head within 3 s.
- **The recap is the board itself:** on the close the camera pulls back over the whole board. Each station gets a numbered label (44 px) in story order, the two rows get titles ("Sam's theory", "what really happened"), and the arrows between stations reappear. Keep the pulled-back board inside x 120-960; a zoom that pushed it to 66 px from the edge was reverted.

## Type

- **Words: Excalifont** (`HAND`), in every label, note, headline, and caption. **Code and terminals: Comic Shanns** (`CODE`), Excalidraw's code font.
- **Sizes in design units** (the safe frame shows them at 0.8×):

  | Text | Size |
  |---|---|
  | headline words | 96 |
  | the address at the end | 100 |
  | content in windows | 40-48 |
  | the smallest readable label | 36 (about 31 px on the phone); 40-44 for UI text a viewer should read |

- **Fake UI texture** nobody needs to read gets `data-deco`. A label inside a scaled figure scales its font up (`Math.ceil(36 / scale)`); Valor's tag measured 26 px before that fix.

## Shapes

- **Draw everything with rough.js** through the toolkit in `examples/valor/scenes.js`: `rr` (rounded rect), `rline`, `rpath`, `rell`, `arrow`. Each call gets a fresh fixed seed from `RO()`, never randomness.
- **Excalidraw's defaults:**
  - roughness 1 and bowing 1;
  - stroke 3.5 for windows (2-2.5 for dividers, 5.5 for figures);
  - hachure gap 4 × stroke at −41°;
  - corner radius min(32, a quarter of the shorter side).
- **Fills:**
  - windows, cards, and heads are solid `PAPER`, so they cover what is behind them;
  - highlights, trays, tags, and badges use hachure or a solid pastel fill (`EX.xF`);
  - sticky notes are solid `yellowF`, rotated 2-4°.
- **Real logos** come from `kit.logo`, monochrome marks drawn in `INK`, placed next to the name. Register a product's own mark with `kit.logo.add`; never redraw a logo.

## The board

One continuous whiteboard, which the camera travels across:

| Area | Where | What happens there |
|---|---|---|
| Board A | x 0-1080 | the hook and the hero's introduction |
| Board B | 1300 px to the right | the hero's desk and the boss |
| Screen world | inside a laptop screen, at 1/12.8 scale | the camera dives in and it plays 1:1 (the plan / critic / build / test / ship montage) |
| A2 | drawn fresh at board A's place | the callback and the address |

- **Vertical zones** (design units):

  | Zone | y |
  |---|---|
  | headline words | about 350 |
  | the main stage | 430-1330, on a ground line |
  | captions | about 1450, or 1272 when the board sits higher (`T.captionY`) |

  Keep everything important above the caption.
- **Full-bleed effects** go behind the safe frame with `svg.insertBefore(node, SAFE)`. A tint clipped to the safe box showed its edges.
- **Text must fit its box.** Measure every label with `getComputedTextLength()` and shorten the words before shrinking the font. "1. one theme switch, whole app" ran past the plan window's border for 10 s; "1. one switch, whole app" fits. Stickers, stamps and notes stay at least 20 px inside the panel they mark.
- **Vary the composition.** One window top right and the hero bottom left in all 21 shots read as a template. Stack two windows, put objects on the ground, bring a second figure in, or move the hero across.
- **Fill the frame:**
  - the main window is 800-900 px wide;
  - no band of the stage stays empty for more than about 1 s; push the camera in on the hero rather than show an empty board.

## Characters

- **One rough.js drawing per pose, three boil variants each, switched by keys** (`figure`, `drawPose`, and the `VP` pose table in `examples/valor/scenes.js`).
  - A pose sets the arm and leg angles, the mouth (`smile`, `big`, `o`, `frown`, `flat`), `look`, `tilt`, `lean`, and props (`mug`, `pen`).
  - Poses available: stand, walk1/walk2, point, pointUp, type/type2, wave, cheer, proud, oops, freeze.
- **The hero keeps one design all reel.**
  - Valor, the robot: a boxy head with an antenna, blue dot eyes, a blue name tag on his chest.
  - A human hero: a round head with a hair stroke; Maya has a bun.
  - The boss, Tom: spiky hair, a coffee mug.
  - A critic: the robot in red with a red pen.
- **Labels sit outside the pose drawings** (the name tag, the "his creator: Tom" note), so they stay put while poses swap.
- **Reactions are few and meaningful.** A pose holds for at least 1 s, and each reaction answers its cause. When the cause leaves, the hero returns to stand.

## Detail kit

The difference between "AI generated" and crafted is detail drawn the Excalidraw way:

- **Windows:** 3 title-bar dots, a divider line, a title. Kinds:
  - chat windows with a badge;
  - inbox rows with initial-avatar circles, unread dots, times, and a scrollbar;
  - a search field;
  - a terminal;
  - a code card in Comic Shanns;
  - a browser bar with "https://".
- **Objects:**
  - laptops, with personality doodles on the screen (eyepatch, cowboy hat, shine lines, captain's cap);
  - trays and folders;
  - a pile of cards;
  - a chair;
  - a progress chip row (plan · review · build · test · ship).
- **The annotation layer**, as a person marking up a whiteboard:
  - handwritten notes with hand-drawn arrows ("wait! simpler way:", "his creator: Tom", "not even one!");
  - scribble underlines;
  - a red circle around a key word;
  - a cross over a wrong option.
- **Stamps:** hachured, rotated, with ink splatter (`splat`), placed only on the thing they judge.
- **The cursor:** a hand-drawn arrow that eases in and clicks, with a press squash and a blue click ring.
