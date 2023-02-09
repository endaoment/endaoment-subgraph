// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class AuthorityUpdated extends ethereum.Event {
  get params(): AuthorityUpdated__Params {
    return new AuthorityUpdated__Params(this);
  }
}

export class AuthorityUpdated__Params {
  _event: AuthorityUpdated;

  constructor(event: AuthorityUpdated) {
    this._event = event;
  }

  get user(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newAuthority(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class DefaultDonationFeeSet extends ethereum.Event {
  get params(): DefaultDonationFeeSet__Params {
    return new DefaultDonationFeeSet__Params(this);
  }
}

export class DefaultDonationFeeSet__Params {
  _event: DefaultDonationFeeSet;

  constructor(event: DefaultDonationFeeSet) {
    this._event = event;
  }

  get entityType(): i32 {
    return this._event.parameters[0].value.toI32();
  }

  get fee(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class DefaultPayoutFeeSet extends ethereum.Event {
  get params(): DefaultPayoutFeeSet__Params {
    return new DefaultPayoutFeeSet__Params(this);
  }
}

export class DefaultPayoutFeeSet__Params {
  _event: DefaultPayoutFeeSet;

  constructor(event: DefaultPayoutFeeSet) {
    this._event = event;
  }

  get entityType(): i32 {
    return this._event.parameters[0].value.toI32();
  }

  get fee(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class DefaultTransferFeeSet extends ethereum.Event {
  get params(): DefaultTransferFeeSet__Params {
    return new DefaultTransferFeeSet__Params(this);
  }
}

export class DefaultTransferFeeSet__Params {
  _event: DefaultTransferFeeSet;

  constructor(event: DefaultTransferFeeSet) {
    this._event = event;
  }

  get fromEntityType(): i32 {
    return this._event.parameters[0].value.toI32();
  }

  get toEntityType(): i32 {
    return this._event.parameters[1].value.toI32();
  }

  get fee(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class DonationFeeReceiverOverrideSet extends ethereum.Event {
  get params(): DonationFeeReceiverOverrideSet__Params {
    return new DonationFeeReceiverOverrideSet__Params(this);
  }
}

export class DonationFeeReceiverOverrideSet__Params {
  _event: DonationFeeReceiverOverrideSet;

  constructor(event: DonationFeeReceiverOverrideSet) {
    this._event = event;
  }

  get entity(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get fee(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class EntityStatusSet extends ethereum.Event {
  get params(): EntityStatusSet__Params {
    return new EntityStatusSet__Params(this);
  }
}

export class EntityStatusSet__Params {
  _event: EntityStatusSet;

  constructor(event: EntityStatusSet) {
    this._event = event;
  }

  get entity(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get isActive(): boolean {
    return this._event.parameters[1].value.toBoolean();
  }
}

export class FactoryApprovalSet extends ethereum.Event {
  get params(): FactoryApprovalSet__Params {
    return new FactoryApprovalSet__Params(this);
  }
}

export class FactoryApprovalSet__Params {
  _event: FactoryApprovalSet;

  constructor(event: FactoryApprovalSet) {
    this._event = event;
  }

  get factory(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get isApproved(): boolean {
    return this._event.parameters[1].value.toBoolean();
  }
}

export class OwnerUpdated extends ethereum.Event {
  get params(): OwnerUpdated__Params {
    return new OwnerUpdated__Params(this);
  }
}

export class OwnerUpdated__Params {
  _event: OwnerUpdated;

  constructor(event: OwnerUpdated) {
    this._event = event;
  }

  get user(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class OwnershipChanged extends ethereum.Event {
  get params(): OwnershipChanged__Params {
    return new OwnershipChanged__Params(this);
  }
}

export class OwnershipChanged__Params {
  _event: OwnershipChanged;

  constructor(event: OwnershipChanged) {
    this._event = event;
  }

  get owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class OwnershipTransferProposed extends ethereum.Event {
  get params(): OwnershipTransferProposed__Params {
    return new OwnershipTransferProposed__Params(this);
  }
}

export class OwnershipTransferProposed__Params {
  _event: OwnershipTransferProposed;

  constructor(event: OwnershipTransferProposed) {
    this._event = event;
  }

  get user(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class PayoutFeeOverrideSet extends ethereum.Event {
  get params(): PayoutFeeOverrideSet__Params {
    return new PayoutFeeOverrideSet__Params(this);
  }
}

export class PayoutFeeOverrideSet__Params {
  _event: PayoutFeeOverrideSet;

  constructor(event: PayoutFeeOverrideSet) {
    this._event = event;
  }

  get entity(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get fee(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class PortfolioStatusSet extends ethereum.Event {
  get params(): PortfolioStatusSet__Params {
    return new PortfolioStatusSet__Params(this);
  }
}

export class PortfolioStatusSet__Params {
  _event: PortfolioStatusSet;

  constructor(event: PortfolioStatusSet) {
    this._event = event;
  }

  get portfolio(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get isActive(): boolean {
    return this._event.parameters[1].value.toBoolean();
  }
}

export class PublicCapabilityUpdated extends ethereum.Event {
  get params(): PublicCapabilityUpdated__Params {
    return new PublicCapabilityUpdated__Params(this);
  }
}

export class PublicCapabilityUpdated__Params {
  _event: PublicCapabilityUpdated;

  constructor(event: PublicCapabilityUpdated) {
    this._event = event;
  }

  get target(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get functionSig(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }

  get enabled(): boolean {
    return this._event.parameters[2].value.toBoolean();
  }
}

export class RoleCapabilityUpdated extends ethereum.Event {
  get params(): RoleCapabilityUpdated__Params {
    return new RoleCapabilityUpdated__Params(this);
  }
}

export class RoleCapabilityUpdated__Params {
  _event: RoleCapabilityUpdated;

  constructor(event: RoleCapabilityUpdated) {
    this._event = event;
  }

  get role(): i32 {
    return this._event.parameters[0].value.toI32();
  }

  get target(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get functionSig(): Bytes {
    return this._event.parameters[2].value.toBytes();
  }

  get enabled(): boolean {
    return this._event.parameters[3].value.toBoolean();
  }
}

export class SwapWrapperStatusSet extends ethereum.Event {
  get params(): SwapWrapperStatusSet__Params {
    return new SwapWrapperStatusSet__Params(this);
  }
}

export class SwapWrapperStatusSet__Params {
  _event: SwapWrapperStatusSet;

  constructor(event: SwapWrapperStatusSet) {
    this._event = event;
  }

  get swapWrapper(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get isSupported(): boolean {
    return this._event.parameters[1].value.toBoolean();
  }
}

export class TransferFeeReceiverOverrideSet extends ethereum.Event {
  get params(): TransferFeeReceiverOverrideSet__Params {
    return new TransferFeeReceiverOverrideSet__Params(this);
  }
}

export class TransferFeeReceiverOverrideSet__Params {
  _event: TransferFeeReceiverOverrideSet;

  constructor(event: TransferFeeReceiverOverrideSet) {
    this._event = event;
  }

  get fromEntityType(): i32 {
    return this._event.parameters[0].value.toI32();
  }

  get toEntity(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get fee(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class TransferFeeSenderOverrideSet extends ethereum.Event {
  get params(): TransferFeeSenderOverrideSet__Params {
    return new TransferFeeSenderOverrideSet__Params(this);
  }
}

export class TransferFeeSenderOverrideSet__Params {
  _event: TransferFeeSenderOverrideSet;

  constructor(event: TransferFeeSenderOverrideSet) {
    this._event = event;
  }

  get fromEntity(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get toEntityType(): i32 {
    return this._event.parameters[1].value.toI32();
  }

  get fee(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class TreasuryChanged extends ethereum.Event {
  get params(): TreasuryChanged__Params {
    return new TreasuryChanged__Params(this);
  }
}

export class TreasuryChanged__Params {
  _event: TreasuryChanged;

  constructor(event: TreasuryChanged) {
    this._event = event;
  }

  get oldTreasury(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newTreasury(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class UserRoleUpdated extends ethereum.Event {
  get params(): UserRoleUpdated__Params {
    return new UserRoleUpdated__Params(this);
  }
}

export class UserRoleUpdated__Params {
  _event: UserRoleUpdated;

  constructor(event: UserRoleUpdated) {
    this._event = event;
  }

  get user(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get role(): i32 {
    return this._event.parameters[1].value.toI32();
  }

  get enabled(): boolean {
    return this._event.parameters[2].value.toBoolean();
  }
}

export class Registry extends ethereum.SmartContract {
  static bind(address: Address): Registry {
    return new Registry("Registry", address);
  }

  authority(): Address {
    let result = super.call("authority", "authority():(address)", []);

    return result[0].toAddress();
  }

  try_authority(): ethereum.CallResult<Address> {
    let result = super.tryCall("authority", "authority():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  baseToken(): Address {
    let result = super.call("baseToken", "baseToken():(address)", []);

    return result[0].toAddress();
  }

  try_baseToken(): ethereum.CallResult<Address> {
    let result = super.tryCall("baseToken", "baseToken():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  canCall(user: Address, target: Address, functionSig: Bytes): boolean {
    let result = super.call(
      "canCall",
      "canCall(address,address,bytes4):(bool)",
      [
        ethereum.Value.fromAddress(user),
        ethereum.Value.fromAddress(target),
        ethereum.Value.fromFixedBytes(functionSig)
      ]
    );

    return result[0].toBoolean();
  }

  try_canCall(
    user: Address,
    target: Address,
    functionSig: Bytes
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "canCall",
      "canCall(address,address,bytes4):(bool)",
      [
        ethereum.Value.fromAddress(user),
        ethereum.Value.fromAddress(target),
        ethereum.Value.fromFixedBytes(functionSig)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  doesRoleHaveCapability(
    role: i32,
    target: Address,
    functionSig: Bytes
  ): boolean {
    let result = super.call(
      "doesRoleHaveCapability",
      "doesRoleHaveCapability(uint8,address,bytes4):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(role)),
        ethereum.Value.fromAddress(target),
        ethereum.Value.fromFixedBytes(functionSig)
      ]
    );

    return result[0].toBoolean();
  }

  try_doesRoleHaveCapability(
    role: i32,
    target: Address,
    functionSig: Bytes
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "doesRoleHaveCapability",
      "doesRoleHaveCapability(uint8,address,bytes4):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(role)),
        ethereum.Value.fromAddress(target),
        ethereum.Value.fromFixedBytes(functionSig)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  doesUserHaveRole(user: Address, role: i32): boolean {
    let result = super.call(
      "doesUserHaveRole",
      "doesUserHaveRole(address,uint8):(bool)",
      [
        ethereum.Value.fromAddress(user),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(role))
      ]
    );

    return result[0].toBoolean();
  }

  try_doesUserHaveRole(user: Address, role: i32): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "doesUserHaveRole",
      "doesUserHaveRole(address,uint8):(bool)",
      [
        ethereum.Value.fromAddress(user),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(role))
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  getDonationFee(_entity: Address): BigInt {
    let result = super.call(
      "getDonationFee",
      "getDonationFee(address):(uint32)",
      [ethereum.Value.fromAddress(_entity)]
    );

    return result[0].toBigInt();
  }

  try_getDonationFee(_entity: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getDonationFee",
      "getDonationFee(address):(uint32)",
      [ethereum.Value.fromAddress(_entity)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getDonationFeeWithOverrides(_entity: Address): BigInt {
    let result = super.call(
      "getDonationFeeWithOverrides",
      "getDonationFeeWithOverrides(address):(uint32)",
      [ethereum.Value.fromAddress(_entity)]
    );

    return result[0].toBigInt();
  }

  try_getDonationFeeWithOverrides(
    _entity: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getDonationFeeWithOverrides",
      "getDonationFeeWithOverrides(address):(uint32)",
      [ethereum.Value.fromAddress(_entity)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getPayoutFee(_entity: Address): BigInt {
    let result = super.call("getPayoutFee", "getPayoutFee(address):(uint32)", [
      ethereum.Value.fromAddress(_entity)
    ]);

    return result[0].toBigInt();
  }

  try_getPayoutFee(_entity: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getPayoutFee",
      "getPayoutFee(address):(uint32)",
      [ethereum.Value.fromAddress(_entity)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getPayoutFeeWithOverrides(_entity: Address): BigInt {
    let result = super.call(
      "getPayoutFeeWithOverrides",
      "getPayoutFeeWithOverrides(address):(uint32)",
      [ethereum.Value.fromAddress(_entity)]
    );

    return result[0].toBigInt();
  }

  try_getPayoutFeeWithOverrides(_entity: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getPayoutFeeWithOverrides",
      "getPayoutFeeWithOverrides(address):(uint32)",
      [ethereum.Value.fromAddress(_entity)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getRolesWithCapability(param0: Address, param1: Bytes): Bytes {
    let result = super.call(
      "getRolesWithCapability",
      "getRolesWithCapability(address,bytes4):(bytes32)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromFixedBytes(param1)
      ]
    );

    return result[0].toBytes();
  }

  try_getRolesWithCapability(
    param0: Address,
    param1: Bytes
  ): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "getRolesWithCapability",
      "getRolesWithCapability(address,bytes4):(bytes32)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromFixedBytes(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  getTransferFee(_sender: Address, _receiver: Address): BigInt {
    let result = super.call(
      "getTransferFee",
      "getTransferFee(address,address):(uint32)",
      [
        ethereum.Value.fromAddress(_sender),
        ethereum.Value.fromAddress(_receiver)
      ]
    );

    return result[0].toBigInt();
  }

  try_getTransferFee(
    _sender: Address,
    _receiver: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getTransferFee",
      "getTransferFee(address,address):(uint32)",
      [
        ethereum.Value.fromAddress(_sender),
        ethereum.Value.fromAddress(_receiver)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getTransferFeeWithOverrides(_sender: Address, _receiver: Address): BigInt {
    let result = super.call(
      "getTransferFeeWithOverrides",
      "getTransferFeeWithOverrides(address,address):(uint32)",
      [
        ethereum.Value.fromAddress(_sender),
        ethereum.Value.fromAddress(_receiver)
      ]
    );

    return result[0].toBigInt();
  }

  try_getTransferFeeWithOverrides(
    _sender: Address,
    _receiver: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getTransferFeeWithOverrides",
      "getTransferFeeWithOverrides(address,address):(uint32)",
      [
        ethereum.Value.fromAddress(_sender),
        ethereum.Value.fromAddress(_receiver)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getUserRoles(param0: Address): Bytes {
    let result = super.call("getUserRoles", "getUserRoles(address):(bytes32)", [
      ethereum.Value.fromAddress(param0)
    ]);

    return result[0].toBytes();
  }

  try_getUserRoles(param0: Address): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "getUserRoles",
      "getUserRoles(address):(bytes32)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  isActiveEntity(param0: Address): boolean {
    let result = super.call(
      "isActiveEntity",
      "isActiveEntity(address):(bool)",
      [ethereum.Value.fromAddress(param0)]
    );

    return result[0].toBoolean();
  }

  try_isActiveEntity(param0: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isActiveEntity",
      "isActiveEntity(address):(bool)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  isActivePortfolio(param0: Address): boolean {
    let result = super.call(
      "isActivePortfolio",
      "isActivePortfolio(address):(bool)",
      [ethereum.Value.fromAddress(param0)]
    );

    return result[0].toBoolean();
  }

  try_isActivePortfolio(param0: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isActivePortfolio",
      "isActivePortfolio(address):(bool)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  isApprovedFactory(param0: Address): boolean {
    let result = super.call(
      "isApprovedFactory",
      "isApprovedFactory(address):(bool)",
      [ethereum.Value.fromAddress(param0)]
    );

    return result[0].toBoolean();
  }

  try_isApprovedFactory(param0: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isApprovedFactory",
      "isApprovedFactory(address):(bool)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  isCapabilityPublic(param0: Address, param1: Bytes): boolean {
    let result = super.call(
      "isCapabilityPublic",
      "isCapabilityPublic(address,bytes4):(bool)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromFixedBytes(param1)
      ]
    );

    return result[0].toBoolean();
  }

  try_isCapabilityPublic(
    param0: Address,
    param1: Bytes
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isCapabilityPublic",
      "isCapabilityPublic(address,bytes4):(bool)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromFixedBytes(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  isSwapperSupported(param0: Address): boolean {
    let result = super.call(
      "isSwapperSupported",
      "isSwapperSupported(address):(bool)",
      [ethereum.Value.fromAddress(param0)]
    );

    return result[0].toBoolean();
  }

  try_isSwapperSupported(param0: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isSwapperSupported",
      "isSwapperSupported(address):(bool)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  pendingOwner(): Address {
    let result = super.call("pendingOwner", "pendingOwner():(address)", []);

    return result[0].toAddress();
  }

  try_pendingOwner(): ethereum.CallResult<Address> {
    let result = super.tryCall("pendingOwner", "pendingOwner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  treasury(): Address {
    let result = super.call("treasury", "treasury():(address)", []);

    return result[0].toAddress();
  }

  try_treasury(): ethereum.CallResult<Address> {
    let result = super.tryCall("treasury", "treasury():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _admin(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _treasury(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _baseToken(): Address {
    return this._call.inputValues[2].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ClaimOwnershipCall extends ethereum.Call {
  get inputs(): ClaimOwnershipCall__Inputs {
    return new ClaimOwnershipCall__Inputs(this);
  }

  get outputs(): ClaimOwnershipCall__Outputs {
    return new ClaimOwnershipCall__Outputs(this);
  }
}

export class ClaimOwnershipCall__Inputs {
  _call: ClaimOwnershipCall;

  constructor(call: ClaimOwnershipCall) {
    this._call = call;
  }
}

export class ClaimOwnershipCall__Outputs {
  _call: ClaimOwnershipCall;

  constructor(call: ClaimOwnershipCall) {
    this._call = call;
  }
}

export class SetAuthorityCall extends ethereum.Call {
  get inputs(): SetAuthorityCall__Inputs {
    return new SetAuthorityCall__Inputs(this);
  }

  get outputs(): SetAuthorityCall__Outputs {
    return new SetAuthorityCall__Outputs(this);
  }
}

export class SetAuthorityCall__Inputs {
  _call: SetAuthorityCall;

  constructor(call: SetAuthorityCall) {
    this._call = call;
  }

  get newAuthority(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetAuthorityCall__Outputs {
  _call: SetAuthorityCall;

  constructor(call: SetAuthorityCall) {
    this._call = call;
  }
}

export class SetDefaultDonationFeeCall extends ethereum.Call {
  get inputs(): SetDefaultDonationFeeCall__Inputs {
    return new SetDefaultDonationFeeCall__Inputs(this);
  }

  get outputs(): SetDefaultDonationFeeCall__Outputs {
    return new SetDefaultDonationFeeCall__Outputs(this);
  }
}

export class SetDefaultDonationFeeCall__Inputs {
  _call: SetDefaultDonationFeeCall;

  constructor(call: SetDefaultDonationFeeCall) {
    this._call = call;
  }

  get _entityType(): i32 {
    return this._call.inputValues[0].value.toI32();
  }

  get _fee(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class SetDefaultDonationFeeCall__Outputs {
  _call: SetDefaultDonationFeeCall;

  constructor(call: SetDefaultDonationFeeCall) {
    this._call = call;
  }
}

export class SetDefaultPayoutFeeCall extends ethereum.Call {
  get inputs(): SetDefaultPayoutFeeCall__Inputs {
    return new SetDefaultPayoutFeeCall__Inputs(this);
  }

  get outputs(): SetDefaultPayoutFeeCall__Outputs {
    return new SetDefaultPayoutFeeCall__Outputs(this);
  }
}

export class SetDefaultPayoutFeeCall__Inputs {
  _call: SetDefaultPayoutFeeCall;

  constructor(call: SetDefaultPayoutFeeCall) {
    this._call = call;
  }

  get _entityType(): i32 {
    return this._call.inputValues[0].value.toI32();
  }

  get _fee(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class SetDefaultPayoutFeeCall__Outputs {
  _call: SetDefaultPayoutFeeCall;

  constructor(call: SetDefaultPayoutFeeCall) {
    this._call = call;
  }
}

export class SetDefaultTransferFeeCall extends ethereum.Call {
  get inputs(): SetDefaultTransferFeeCall__Inputs {
    return new SetDefaultTransferFeeCall__Inputs(this);
  }

  get outputs(): SetDefaultTransferFeeCall__Outputs {
    return new SetDefaultTransferFeeCall__Outputs(this);
  }
}

export class SetDefaultTransferFeeCall__Inputs {
  _call: SetDefaultTransferFeeCall;

  constructor(call: SetDefaultTransferFeeCall) {
    this._call = call;
  }

  get _fromEntityType(): i32 {
    return this._call.inputValues[0].value.toI32();
  }

  get _toEntityType(): i32 {
    return this._call.inputValues[1].value.toI32();
  }

  get _fee(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class SetDefaultTransferFeeCall__Outputs {
  _call: SetDefaultTransferFeeCall;

  constructor(call: SetDefaultTransferFeeCall) {
    this._call = call;
  }
}

export class SetDonationFeeReceiverOverrideCall extends ethereum.Call {
  get inputs(): SetDonationFeeReceiverOverrideCall__Inputs {
    return new SetDonationFeeReceiverOverrideCall__Inputs(this);
  }

  get outputs(): SetDonationFeeReceiverOverrideCall__Outputs {
    return new SetDonationFeeReceiverOverrideCall__Outputs(this);
  }
}

export class SetDonationFeeReceiverOverrideCall__Inputs {
  _call: SetDonationFeeReceiverOverrideCall;

  constructor(call: SetDonationFeeReceiverOverrideCall) {
    this._call = call;
  }

  get _entity(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _fee(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class SetDonationFeeReceiverOverrideCall__Outputs {
  _call: SetDonationFeeReceiverOverrideCall;

  constructor(call: SetDonationFeeReceiverOverrideCall) {
    this._call = call;
  }
}

export class SetEntityActiveCall extends ethereum.Call {
  get inputs(): SetEntityActiveCall__Inputs {
    return new SetEntityActiveCall__Inputs(this);
  }

  get outputs(): SetEntityActiveCall__Outputs {
    return new SetEntityActiveCall__Outputs(this);
  }
}

export class SetEntityActiveCall__Inputs {
  _call: SetEntityActiveCall;

  constructor(call: SetEntityActiveCall) {
    this._call = call;
  }

  get _entity(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetEntityActiveCall__Outputs {
  _call: SetEntityActiveCall;

  constructor(call: SetEntityActiveCall) {
    this._call = call;
  }
}

export class SetEntityStatusCall extends ethereum.Call {
  get inputs(): SetEntityStatusCall__Inputs {
    return new SetEntityStatusCall__Inputs(this);
  }

  get outputs(): SetEntityStatusCall__Outputs {
    return new SetEntityStatusCall__Outputs(this);
  }
}

export class SetEntityStatusCall__Inputs {
  _call: SetEntityStatusCall;

  constructor(call: SetEntityStatusCall) {
    this._call = call;
  }

  get _entity(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _isActive(): boolean {
    return this._call.inputValues[1].value.toBoolean();
  }
}

export class SetEntityStatusCall__Outputs {
  _call: SetEntityStatusCall;

  constructor(call: SetEntityStatusCall) {
    this._call = call;
  }
}

export class SetFactoryApprovalCall extends ethereum.Call {
  get inputs(): SetFactoryApprovalCall__Inputs {
    return new SetFactoryApprovalCall__Inputs(this);
  }

  get outputs(): SetFactoryApprovalCall__Outputs {
    return new SetFactoryApprovalCall__Outputs(this);
  }
}

export class SetFactoryApprovalCall__Inputs {
  _call: SetFactoryApprovalCall;

  constructor(call: SetFactoryApprovalCall) {
    this._call = call;
  }

  get _factory(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _isApproved(): boolean {
    return this._call.inputValues[1].value.toBoolean();
  }
}

export class SetFactoryApprovalCall__Outputs {
  _call: SetFactoryApprovalCall;

  constructor(call: SetFactoryApprovalCall) {
    this._call = call;
  }
}

export class SetPayoutFeeOverrideCall extends ethereum.Call {
  get inputs(): SetPayoutFeeOverrideCall__Inputs {
    return new SetPayoutFeeOverrideCall__Inputs(this);
  }

  get outputs(): SetPayoutFeeOverrideCall__Outputs {
    return new SetPayoutFeeOverrideCall__Outputs(this);
  }
}

export class SetPayoutFeeOverrideCall__Inputs {
  _call: SetPayoutFeeOverrideCall;

  constructor(call: SetPayoutFeeOverrideCall) {
    this._call = call;
  }

  get _entity(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _fee(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class SetPayoutFeeOverrideCall__Outputs {
  _call: SetPayoutFeeOverrideCall;

  constructor(call: SetPayoutFeeOverrideCall) {
    this._call = call;
  }
}

export class SetPortfolioStatusCall extends ethereum.Call {
  get inputs(): SetPortfolioStatusCall__Inputs {
    return new SetPortfolioStatusCall__Inputs(this);
  }

  get outputs(): SetPortfolioStatusCall__Outputs {
    return new SetPortfolioStatusCall__Outputs(this);
  }
}

export class SetPortfolioStatusCall__Inputs {
  _call: SetPortfolioStatusCall;

  constructor(call: SetPortfolioStatusCall) {
    this._call = call;
  }

  get _portfolio(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _isActive(): boolean {
    return this._call.inputValues[1].value.toBoolean();
  }
}

export class SetPortfolioStatusCall__Outputs {
  _call: SetPortfolioStatusCall;

  constructor(call: SetPortfolioStatusCall) {
    this._call = call;
  }
}

export class SetPublicCapabilityCall extends ethereum.Call {
  get inputs(): SetPublicCapabilityCall__Inputs {
    return new SetPublicCapabilityCall__Inputs(this);
  }

  get outputs(): SetPublicCapabilityCall__Outputs {
    return new SetPublicCapabilityCall__Outputs(this);
  }
}

export class SetPublicCapabilityCall__Inputs {
  _call: SetPublicCapabilityCall;

  constructor(call: SetPublicCapabilityCall) {
    this._call = call;
  }

  get target(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get functionSig(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }

  get enabled(): boolean {
    return this._call.inputValues[2].value.toBoolean();
  }
}

export class SetPublicCapabilityCall__Outputs {
  _call: SetPublicCapabilityCall;

  constructor(call: SetPublicCapabilityCall) {
    this._call = call;
  }
}

export class SetRoleCapabilityCall extends ethereum.Call {
  get inputs(): SetRoleCapabilityCall__Inputs {
    return new SetRoleCapabilityCall__Inputs(this);
  }

  get outputs(): SetRoleCapabilityCall__Outputs {
    return new SetRoleCapabilityCall__Outputs(this);
  }
}

export class SetRoleCapabilityCall__Inputs {
  _call: SetRoleCapabilityCall;

  constructor(call: SetRoleCapabilityCall) {
    this._call = call;
  }

  get role(): i32 {
    return this._call.inputValues[0].value.toI32();
  }

  get target(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get functionSig(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }

  get enabled(): boolean {
    return this._call.inputValues[3].value.toBoolean();
  }
}

export class SetRoleCapabilityCall__Outputs {
  _call: SetRoleCapabilityCall;

  constructor(call: SetRoleCapabilityCall) {
    this._call = call;
  }
}

export class SetSwapWrapperStatusCall extends ethereum.Call {
  get inputs(): SetSwapWrapperStatusCall__Inputs {
    return new SetSwapWrapperStatusCall__Inputs(this);
  }

  get outputs(): SetSwapWrapperStatusCall__Outputs {
    return new SetSwapWrapperStatusCall__Outputs(this);
  }
}

export class SetSwapWrapperStatusCall__Inputs {
  _call: SetSwapWrapperStatusCall;

  constructor(call: SetSwapWrapperStatusCall) {
    this._call = call;
  }

  get _swapWrapper(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _supported(): boolean {
    return this._call.inputValues[1].value.toBoolean();
  }
}

export class SetSwapWrapperStatusCall__Outputs {
  _call: SetSwapWrapperStatusCall;

  constructor(call: SetSwapWrapperStatusCall) {
    this._call = call;
  }
}

export class SetTransferFeeReceiverOverrideCall extends ethereum.Call {
  get inputs(): SetTransferFeeReceiverOverrideCall__Inputs {
    return new SetTransferFeeReceiverOverrideCall__Inputs(this);
  }

  get outputs(): SetTransferFeeReceiverOverrideCall__Outputs {
    return new SetTransferFeeReceiverOverrideCall__Outputs(this);
  }
}

export class SetTransferFeeReceiverOverrideCall__Inputs {
  _call: SetTransferFeeReceiverOverrideCall;

  constructor(call: SetTransferFeeReceiverOverrideCall) {
    this._call = call;
  }

  get _fromEntityType(): i32 {
    return this._call.inputValues[0].value.toI32();
  }

  get _toEntity(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _fee(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class SetTransferFeeReceiverOverrideCall__Outputs {
  _call: SetTransferFeeReceiverOverrideCall;

  constructor(call: SetTransferFeeReceiverOverrideCall) {
    this._call = call;
  }
}

export class SetTransferFeeSenderOverrideCall extends ethereum.Call {
  get inputs(): SetTransferFeeSenderOverrideCall__Inputs {
    return new SetTransferFeeSenderOverrideCall__Inputs(this);
  }

  get outputs(): SetTransferFeeSenderOverrideCall__Outputs {
    return new SetTransferFeeSenderOverrideCall__Outputs(this);
  }
}

export class SetTransferFeeSenderOverrideCall__Inputs {
  _call: SetTransferFeeSenderOverrideCall;

  constructor(call: SetTransferFeeSenderOverrideCall) {
    this._call = call;
  }

  get _fromEntity(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _toEntityType(): i32 {
    return this._call.inputValues[1].value.toI32();
  }

  get _fee(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class SetTransferFeeSenderOverrideCall__Outputs {
  _call: SetTransferFeeSenderOverrideCall;

  constructor(call: SetTransferFeeSenderOverrideCall) {
    this._call = call;
  }
}

export class SetTreasuryCall extends ethereum.Call {
  get inputs(): SetTreasuryCall__Inputs {
    return new SetTreasuryCall__Inputs(this);
  }

  get outputs(): SetTreasuryCall__Outputs {
    return new SetTreasuryCall__Outputs(this);
  }
}

export class SetTreasuryCall__Inputs {
  _call: SetTreasuryCall;

  constructor(call: SetTreasuryCall) {
    this._call = call;
  }

  get _newTreasury(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetTreasuryCall__Outputs {
  _call: SetTreasuryCall;

  constructor(call: SetTreasuryCall) {
    this._call = call;
  }
}

export class SetUserRoleCall extends ethereum.Call {
  get inputs(): SetUserRoleCall__Inputs {
    return new SetUserRoleCall__Inputs(this);
  }

  get outputs(): SetUserRoleCall__Outputs {
    return new SetUserRoleCall__Outputs(this);
  }
}

export class SetUserRoleCall__Inputs {
  _call: SetUserRoleCall;

  constructor(call: SetUserRoleCall) {
    this._call = call;
  }

  get user(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get role(): i32 {
    return this._call.inputValues[1].value.toI32();
  }

  get enabled(): boolean {
    return this._call.inputValues[2].value.toBoolean();
  }
}

export class SetUserRoleCall__Outputs {
  _call: SetUserRoleCall;

  constructor(call: SetUserRoleCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get _newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}