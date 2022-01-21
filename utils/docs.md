Ofwel partieel formaat:

```json lines
{"command": "start-judgement", "version": 2}
{"command": "start-group", "name": "Controle op bestaande code", "visibility": "show"}
{"command": "start-group", "name": "Controle op blokjes", "visibility": "show"}
{"command": "start-test", "name": ":Schip:"}
{"command": "append-diff", "actual": "false", "expected": "false"}
{"command": "close-test", "feedback": "Top! Je hebt niets veranderd aan de sprite :Schip:.", "status": "correct"}
{"command": "close-group"}
{"command": "start-group", "name": "Controle op bestaande sprites", "visibility": "show"}
{"command": "start-test", "name": ":Schip:"}
{"command": "append-diff", "actual": "false", "expected": "true"}
{"command": "close-test", "feedback": "Top! Je hebt niets veranderd aan de blokjes.", "status": "wrong"}
{"command": "close-group"}
{"command": "close-group"}
{"command": "close-judgement"}
```

Ofwel volledig formaat:

```json
{
  "version": 2,
  "groups": [
    {
      "name": "Controle op bestaande code",
      "visibility": "show",
      "tests": [
        {
          "name": ":Schip:",
          "feedback": "Top! Je hebt niets veranderd aan de sprite :Schip:.",
          "status": "correct",
          "diff": {
            "expected": "false",
            "actual": "false"
          }
        }
      ]
    },
    {
      "name": "Controle op bestaande sprites",
      "visibility": "show",
      "tests": [
        {
          "name": ":Schip:",
          "feedback": "Top! Je hebt niets veranderd aan de blokjes",
          "status": "wrong",
          "diff": {
            "expected": "true",
            "actual": "false"
          }
        }
      ]
    }
  ]
}
```
