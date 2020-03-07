pragma solidity >=0.4.22 <0.6.0;

library Types {
    struct Member {
        address memberAddr;
        bool loanTaken;
        bool isEntity;
    }

    struct Fund {
        address fundAddress;
        string fundName;
        bool isActive;
    }
}