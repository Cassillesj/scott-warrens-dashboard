# Dinner Decider photos

The tournament tries to load a photo for each food in this order:

1. A local file in this folder named `<id>.jpg`
2. A photo hotlinked from Wikimedia Commons (freely licensed)
3. A built-in illustration (automatic fallback, nothing to do)

To use your own photo for any food, drop a square-ish JPG in this folder
with one of these exact names:

```
italian.jpg   greek.jpg      moroccan.jpg   kebabs.jpg
sushi.jpg     japanese.jpg   burgers.jpg    ribs.jpg
thai.jpg      indian.jpg     chinese.jpg    mexican.jpg
vietnamese.jpg fishchips.jpg parmy.jpg      steak.jpg
```

No code changes needed — local files automatically win over the hotlinked photos.
