{
    identifier: "idle", strategy: "prioritised",
    children: [
        {
            identifier: "fight", strategy: "prioritised",
            children: [
                { identifier: "shoot", strategy: "prioritised" },
                { identifier: "stand", strategy: "prioritised" },
            ]
        }
    ]
}