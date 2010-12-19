{
    identifier: "Idle", strategy: "prioritised",
    children: [
        {
            identifier: "Shoot", strategy: "prioritised",
            children: [
                { identifier: "Idle", pointer: true, strategy: "hereditory" }
            ]
        }
    ]
}