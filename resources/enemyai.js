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
                {
                    identifier: "findCover", strategy: "sequential",
                    children: [
                        { identifier: "turnTowardsPlayer" },
                        { identifier: "stand" },
                        { identifier: "runForCover" },
                        { identifier: "shoot" },
                    ]
                },
                { identifier: "stop" },
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
                { identifier: "switchWeapon" },
            ]
        }
    ]
}