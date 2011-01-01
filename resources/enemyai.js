{
    identifier: "idle", strategy: "prioritised",
    children: [
        { identifier: "spot", strategy: "sequential",
            children: [
                { identifier: "callRange" },
            ]
        },
        {
            identifier: "fight", strategy: "prioritised",
            children: [
                { identifier: "enlistSpotter" },
                { identifier: "throwGrenade", test: "canThrowGrenade" },
                { identifier: "shoot" },
                {
                    identifier: "reload", strategy: "sequential",
                    children: [
                        { identifier: "crouch" },
                        { identifier: "reload" },
                    ]
                },
                { identifier: "stand" },
                { identifier: "turnTowardsPlayer" },
            ]
        }
    ]
}