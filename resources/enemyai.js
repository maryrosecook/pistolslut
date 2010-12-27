{
    identifier: "idle", strategy: "prioritised",
    children: [
        {
            identifier: "fight", strategy: "prioritised",
            children: [
                { identifier: "throwAccurateGrenade", test: "canThrowGrenade" },
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